import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

/**
 * GET /api/deployments/[id]
 * 
 * Retrieves deployment information by ID.
 * Flow:
 * 1. Query the database for deployment info (subdomain, serverIP, etc.)
 * 2. Contact the CLI API server running on the deployment server to get real-time stats
 * 3. Merge database info with live stats and return to the client
 * 
 * This enables real-time monitoring of deployments while keeping persistent data in the database.
 */

interface LiveStats {
  status?: string;
  resources?: {
    cpu: number;
    memory: number;
    diskUsed: number;
    diskUsagePercent: number;
  };
  health?: {
    status: string;
    responseTime: number;
    lastCheck: string;
  };
  ssl?: {
    enabled: boolean;
    expiresAt?: string;
    issuer?: string;
    daysUntilExpiry?: number;
    certificate?: string;
  };
  uptime?: string;
  logs?: string[];
}

interface DeploymentData {
  id: string;
  projectName: string;
  subdomain: string;
  framework: string;
  status: string;
  url: string;
  uptime: string;
  lastUpdated: string;
  serverIP: string;
  serverPort: number;
  createdAt: string;
  health: {
    status: string;
    responseTime: number;
    lastCheck: string;
  };
  resources: {
    cpu: number;
    memory: number;
    disk: number;
    diskUsed: number; // in GB
    diskLimit: number; // in GB (15GB max)
  };
  ssl: {
    enabled: boolean;
    expiresAt?: string;
    issuer?: string;
    daysUntilExpiry?: number;
    certificate?: string;
  };
  logs: string[];
}

// Helper to contact the deployment server and get real-time stats
async function getDeploymentStats(serverIP: string, deploymentId: string, port: number = 8080): Promise<LiveStats> {
  try {
    // Try to contact the CLI API endpoint on the deployment server
    // This assumes the CLI has a local API server running for status queries
    const apiUrl = `http://${serverIP}:${port}/api/deployments/${deploymentId}`;
    console.log(`Attempting to contact CLI server at: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (response.ok) {
      const data = await response.json();
      
      // Check if the response has the expected structure from CLI API server
      if (data.success && data.deployment) {
        const deployment = data.deployment;
        return {
          status: deployment.status,
          resources: {
            cpu: deployment.resources?.cpu || 0,
            memory: deployment.resources?.memory || 0,
            diskUsed: deployment.resources?.diskUsed || 0,
            diskUsagePercent: deployment.resources?.disk || 0
          },
          health: deployment.health || { status: 'unknown', responseTime: 0, lastCheck: new Date().toISOString() },
          ssl: deployment.ssl || { enabled: false },
          uptime: deployment.uptime,
          logs: deployment.logs || []
        };
      } else {
        throw new Error('Invalid response format from CLI server');
      }
    } else {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Failed to contact deployment server ${serverIP}:${port}:`, error);
    // Return fallback data if server is unreachable
    return {
      status: 'unknown',
      resources: { cpu: 0, memory: 0, diskUsed: 0, diskUsagePercent: 0 },
      health: { status: 'unreachable', responseTime: 0, lastCheck: new Date().toISOString() },
      uptime: 'N/A',
      logs: [
        `[${new Date().toISOString()}] Failed to contact deployment server - server may be offline`,
        `[${new Date().toISOString()}] Attempted connection to ${serverIP}:${port}`,
        `[${new Date().toISOString()}] This deployment may need manual restart`
      ]
    };
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: deploymentId } = await params;

    if (!deploymentId) {
      return NextResponse.json(
        { error: 'Deployment ID is required' },
        { status: 400 }
      );
    }

    // Connect to database and find the deployment
    const db = await getDatabase();
    const deployment = await db.collection('deployments').findOne({ id: deploymentId });

    if (!deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      );
    }

    // Calculate uptime
    const calculateUptime = (startTime: string | Date): string => {
      const start = new Date(startTime);
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    };

    // Get real-time stats from the deployment server
    console.log(`Fetching real-time stats for deployment ${deploymentId} from server ${deployment.serverIP}:${deployment.port || 8080}`);
    const liveStats = await getDeploymentStats(deployment.serverIP, deploymentId, deployment.port || 8080);

    // Merge database data with live stats
    const deploymentData: DeploymentData = {
      id: deployment.id,
      projectName: deployment.projectName,
      subdomain: deployment.subdomain,
      framework: deployment.framework,
      status: liveStats.status || deployment.status || 'unknown',
      url: deployment.url,
      uptime: liveStats.uptime || calculateUptime(deployment.createdAt),
      lastUpdated: new Date().toISOString(),
      serverIP: deployment.serverIP,
      serverPort: deployment.port,
      createdAt: deployment.createdAt,
      health: {
        status: liveStats.health?.status || 'unknown',
        responseTime: liveStats.health?.responseTime || 0,
        lastCheck: new Date().toISOString()
      },
      resources: {
        cpu: liveStats.resources?.cpu || 0,
        memory: liveStats.resources?.memory || 0,
        disk: liveStats.resources?.diskUsagePercent || 0,
        diskUsed: liveStats.resources?.diskUsed ? (liveStats.resources.diskUsed / (1024 * 1024 * 1024)) : 0, // Convert bytes to GB
        diskLimit: 15 // 15GB limit
      },
      ssl: liveStats.ssl || {
        enabled: deployment.url?.startsWith('https://') || false,
        expiresAt: deployment.sslExpiresAt || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      },
      logs: liveStats.logs || [
        `[${new Date().toISOString()}] Deployment created`,
        `[${deployment.createdAt}] Initial deployment completed`
      ]
    };

    // Update the database with the latest status
    await db.collection('deployments').updateOne(
      { id: deploymentId },
      { 
        $set: { 
          lastChecked: new Date().toISOString(),
          status: deploymentData.status,
          health: deploymentData.health
        } 
      }
    );

    return NextResponse.json(deploymentData);

  } catch (error) {
    console.error('Error fetching deployment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
