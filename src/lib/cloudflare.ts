import {
  CloudflareRecord,
  CloudflareCreateRecordRequest,
  CloudflareResponse,
  SubdomainResponse,
  SubdomainStatus
} from '@/types/api';

class CloudflareService {
  private apiToken: string;
  private zoneId: string;
  private baseUrl = 'https://api.cloudflare.com/client/v4';

  constructor() {
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN!;
    this.zoneId = process.env.CLOUDFLARE_ZONE_ID!;

    if (!this.apiToken || this.apiToken === 'your_api_token_here') {
      throw new Error('Missing or invalid CLOUDFLARE_API_TOKEN in environment variables');
    }
    if (!this.zoneId || this.zoneId === 'your_zone_id_here') {
      throw new Error('Missing or invalid CLOUDFLARE_ZONE_ID in environment variables');
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<CloudflareResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorDetails = '';
      try {
        const errorBody = await response.text();
        const parsedError = JSON.parse(errorBody);
        if (parsedError.errors && parsedError.errors.length > 0) {
          errorDetails = ` - ${parsedError.errors.map((e: { message: string, code?: number }) => `${e.code ? `[${e.code}] ` : ''}${e.message}`).join(', ')}`;
        }
      } catch {
      }
      
      // Provide specific guidance for common errors
      let troubleshooting = '';
      if (response.status === 403) {
        troubleshooting = '\nThis is likely due to insufficient API token permissions. Please ensure your token has:\n' +
                         '   - Zone:Zone:Read permission\n' +
                         '   - Zone:DNS:Edit permission\n' +
                         '   - User:User:Read permission (for health checks)';
      } else if (response.status === 401) {
        troubleshooting = '\n💡 Invalid or expired API token. Please check your CLOUDFLARE_API_TOKEN.';
      }
      
      throw new Error(`Cloudflare API error: ${response.status} ${response.statusText}${errorDetails}${troubleshooting}`);
    }

    return response.json();
  }

  async createSubdomain(
    subdomain: string,
    targetIp: string = '192.0.2.1' // Default placeholder IP
  ): Promise<SubdomainResponse> {
    const baseDomain = 'agfe.tech'; // removed BASE_DOMAIN env since I'm dumb and added it wrong url in env and am too lazy to edit it 

    const recordData: CloudflareCreateRecordRequest = {
      type: 'A',
      name: subdomain,
      content: targetIp,
      ttl: 300, // 5 minutes for faster propagation during development
      proxied: false // Direct DNS - no Cloudflare proxy for local deployments
    };

    console.log(`Creating DNS record: ${subdomain}.${baseDomain} -> ${targetIp}`);

    try {
      const response = await this.makeRequest<CloudflareRecord>(
        `/zones/${this.zoneId}/dns_records`,
        {
          method: 'POST',
          body: JSON.stringify(recordData),
        }
      );

      if (!response.success) {
        throw new Error(`Failed to create DNS record: ${response.errors.map(e => e.message).join(', ')}`);
      }

      const fullDomain = `${subdomain}.${baseDomain}`;
      console.log(`DNS record created successfully: ${fullDomain} -> ${targetIp}`);
      
      return {
        subdomain,
        url: `http://${fullDomain}`, // Use HTTP for direct connections
        cloudflareRecordId: response.result.id,
        status: SubdomainStatus.ACTIVE
      };
    } catch (error) {
      console.error('Error creating subdomain:', error);
      throw error;
    }
  }

  async createSubdomainWithRetry(
    preferredSubdomain?: string,
    targetIp: string = '192.0.2.1',
    maxRetries: number = 5
  ): Promise<SubdomainResponse> {
    let subdomain = preferredSubdomain;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Generate a new subdomain if not provided or if retrying
        if (!subdomain || attempt > 0) {
          subdomain = await this.generateUniqueSubdomain();
        }

        console.log(`Attempting to create subdomain: ${subdomain} (attempt ${attempt + 1}/${maxRetries})`);
        
        const result = await this.createSubdomain(subdomain, targetIp);
        console.log(`Successfully created subdomain: ${subdomain}`);
        return result;

      } catch (error: unknown) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Check if this is a duplicate record error
        const errorMessage = lastError.message;
        const isDuplicateError = errorMessage?.includes('identical record already exists') || 
                                errorMessage?.includes('81058');
        
        if (isDuplicateError) {
          console.log(`Subdomain ${subdomain} already exists, generating a new one...`);
          subdomain = undefined; // Force generation of new subdomain on next attempt
          continue;
        } else {
          // For non-duplicate errors, don't retry
          console.error(`Non-retryable error creating subdomain: ${lastError.message}`);
          throw lastError;
        }
      }
    }

    // If we've exhausted all retries
    throw new Error(`Failed to create subdomain after ${maxRetries} attempts. Last error: ${lastError?.message}`);
  }

  async deleteSubdomain(recordId: string): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ id: string }>(
        `/zones/${this.zoneId}/dns_records/${recordId}`,
        {
          method: 'DELETE',
        }
      );

      return response.success;
    } catch (error) {
      console.error('Error deleting subdomain:', error);
      return false;
    }
  }

  async updateSubdomain(
    recordId: string,
    updates: Partial<CloudflareCreateRecordRequest>
  ): Promise<CloudflareRecord | null> {
    try {
      const response = await this.makeRequest<CloudflareRecord>(
        `/zones/${this.zoneId}/dns_records/${recordId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(updates),
        }
      );

      if (!response.success) {
        throw new Error(`Failed to update DNS record: ${response.errors.map(e => e.message).join(', ')}`);
      }

      return response.result;
    } catch (error) {
      console.error('Error updating subdomain:', error);
      return null;
    }
  }

  async getRecord(recordId: string): Promise<CloudflareRecord | null> {
    try {
      const response = await this.makeRequest<CloudflareRecord>(
        `/zones/${this.zoneId}/dns_records/${recordId}`
      );

      return response.success ? response.result : null;
    } catch (error) {
      console.error('Error fetching DNS record:', error);
      return null;
    }
  }

  async listRecords(subdomain?: string): Promise<CloudflareRecord[]> {
    try {
      const params = new URLSearchParams();
      if (subdomain) {
        params.append('name', subdomain);
      }

      const response = await this.makeRequest<CloudflareRecord[]>(
        `/zones/${this.zoneId}/dns_records?${params.toString()}`
      );

      return response.success ? response.result : [];
    } catch (error) {
      console.error('Error listing DNS records:', error);
      return [];
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      console.log('Starting Cloudflare health check...');
      
      console.log('Verifying API token...');
      const userResponse = await this.makeRequest<{ id: string; email: string }>(
        '/user'
      );
      
      if (!userResponse.success) {
        console.error('Cloudflare health check failed: Invalid API token or user verification failed');
        return false;
      }
      
      console.log(`API token verified for user: ${userResponse.result.email}`);

      // Then verify zone access
      console.log(`Verifying zone access for zone ID: ${this.zoneId}`);
      const zoneResponse = await this.makeRequest<{ id: string; name: string }>(
        `/zones/${this.zoneId}`
      );
      
      if (!zoneResponse.success) {
        console.error('Cloudflare health check failed: Zone access denied or zone not found');
        return false;
      }
      
      console.log(`Zone access verified for: ${zoneResponse.result.name}`);
      return true;
    } catch (error) {
      console.error('Cloudflare health check failed:', error);
      return false;
    }
  }

  generateSubdomain(): string {
    const length = parseInt(process.env.SUBDOMAIN_LENGTH || '10');
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    try {
      const records = await this.listRecords(subdomain);
      return records.length === 0;
    } catch (error) {
      console.error('Error checking subdomain availability:', error);
      return false;
    }
  }

  async generateUniqueSubdomain(): Promise<string> {
    let subdomain: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      subdomain = this.generateSubdomain();
      attempts++;
      
      if (attempts > maxAttempts) {
        throw new Error('Unable to generate unique subdomain after multiple attempts');
      }
    } while (!(await this.isSubdomainAvailable(subdomain)));

    return subdomain;
  }

  async verifyDNSRecord(subdomain: string, expectedIP: string): Promise<{ success: boolean; currentIP?: string; error?: string }> {
    try {
      const baseDomain = process.env.BASE_DOMAIN || 'agfe.tech';
      const fullDomain = `${subdomain}.${baseDomain}`;
      
      console.log(`Verifying DNS record: ${fullDomain} should point to ${expectedIP}`);
      
      // Use a public DNS resolver to check the record
      const dnsResponse = await fetch(`https://cloudflare-dns.com/dns-query?name=${fullDomain}&type=A`, {
        headers: {
          'Accept': 'application/dns-json'
        }
      });
      
      if (!dnsResponse.ok) {
        return { success: false, error: 'DNS lookup failed' };
      }
      
      const dnsData = await dnsResponse.json();
      
      if (dnsData.Answer && dnsData.Answer.length > 0) {
        const currentIP = dnsData.Answer[0].data;
        const success = currentIP === expectedIP;
        
        console.log(`DNS verification: ${fullDomain} -> ${currentIP} (expected: ${expectedIP})`);
        
        return {
          success,
          currentIP,
          error: success ? undefined : `IP mismatch: expected ${expectedIP}, got ${currentIP}`
        };
      } else {
        return { success: false, error: 'No DNS record found' };
      }
    } catch (error) {
      console.error('DNS verification error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export default CloudflareService;
