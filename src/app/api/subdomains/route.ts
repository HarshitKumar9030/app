import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Collections } from '@/lib/mongodb';
import CloudflareService from '@/lib/cloudflare';
import { Subdomain, SubdomainRequest, ApiResponse, SubdomainResponse, SubdomainStatus } from '@/types/api';
import { Document } from 'mongodb';

interface SubdomainDocument extends Document {
  subdomain: string;
  userId: string;
  deploymentId: string;
  cloudflareRecordId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export async function POST(request: NextRequest) {
  try {
    const body: SubdomainRequest = await request.json();
    const { deploymentId, userId, publicIP } = body;

    if (!deploymentId || !userId) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Missing required fields: deploymentId and userId'
        }
      }, { status: 400 });
    }

    // Validate publicIP if provided
    if (publicIP && !/^\d+\.\d+\.\d+\.\d+$/.test(publicIP)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'INVALID_IP',
          message: 'Invalid public IP address format'
        }
      }, { status: 400 });
    }

    const cloudflare = new CloudflareService();
    
    const targetIP = publicIP || '192.0.2.1';
    const cloudflareResponse = await cloudflare.createSubdomainWithRetry(undefined, targetIP);
    const subdomain = cloudflareResponse.subdomain;
    
    const subdomainsCollection = await getCollection<SubdomainDocument>(Collections.SUBDOMAINS);
    
    const subdomainDoc: Omit<Subdomain, '_id'> = {
      subdomain,
      userId,
      deploymentId,
      cloudflareRecordId: cloudflareResponse.cloudflareRecordId,
      status: cloudflareResponse.status,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await subdomainsCollection.insertOne(subdomainDoc as SubdomainDocument);
    
    if (!result.acknowledged) {
      await cloudflare.deleteSubdomain(cloudflareResponse.cloudflareRecordId);
      throw new Error('Failed to save subdomain to database');
    }

    return NextResponse.json<ApiResponse<SubdomainResponse>>({
      success: true,
      data: cloudflareResponse,
      meta: {
        timestamp: new Date(),
        requestId: crypto.randomUUID(),
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('Error creating subdomain:', error);
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const deploymentId = searchParams.get('deploymentId');

    if (!userId && !deploymentId) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'MISSING_PARAMS',
          message: 'Either userId or deploymentId parameter is required'
        }
      }, { status: 400 });
    }

    const subdomainsCollection = await getCollection<SubdomainDocument>(Collections.SUBDOMAINS);
    
    const filter: Record<string, string> = {};
    if (userId) filter.userId = userId;
    if (deploymentId) filter.deploymentId = deploymentId;

    const subdomains = await subdomainsCollection.find(filter).toArray();

    return NextResponse.json<ApiResponse<Subdomain[]>>({
      success: true,
      data: subdomains.map(doc => ({
        _id: doc._id?.toString(),
        subdomain: doc.subdomain,
        userId: doc.userId,
        deploymentId: doc.deploymentId,
        cloudflareRecordId: doc.cloudflareRecordId,
        status: doc.status as SubdomainStatus,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        expiresAt: doc.expiresAt
      })),
      meta: {
        timestamp: new Date(),
        requestId: crypto.randomUUID(),
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('Error fetching subdomains:', error);
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { deploymentId, publicIP, subdomain } = body;

    if (!deploymentId && !subdomain) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Either deploymentId or subdomain is required'
        }
      }, { status: 400 });
    }

    if (!publicIP || !/^\d+\.\d+\.\d+\.\d+$/.test(publicIP)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'INVALID_IP',
          message: 'Valid public IP address is required'
        }
      }, { status: 400 });
    }

    const subdomainsCollection = await getCollection<SubdomainDocument>(Collections.SUBDOMAINS);
    
    // Find existing subdomain record
    const filter: Record<string, string> = {};
    if (deploymentId) filter.deploymentId = deploymentId;
    if (subdomain) filter.subdomain = subdomain;

    const existingRecord = await subdomainsCollection.findOne(filter);
    
    if (!existingRecord) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'SUBDOMAIN_NOT_FOUND',
          message: 'Subdomain record not found'
        }
      }, { status: 404 });
    }

    // Update DNS record via Cloudflare
    const cloudflare = new CloudflareService();
    
    try {
      const updatedRecord = await cloudflare.updateSubdomain(existingRecord.cloudflareRecordId, {
        content: publicIP
      });
      
      if (!updatedRecord) {
        throw new Error('Failed to update DNS record');
      }
      
      // Update database record
      await subdomainsCollection.updateOne(
        { _id: existingRecord._id },
        { 
          $set: { 
            updatedAt: new Date(),
            status: 'active'
          } 
        }
      );

      return NextResponse.json<ApiResponse<{ message: string }>>({
        success: true,
        data: {
          message: `DNS record updated for ${existingRecord.subdomain}.forgecli.tech -> ${publicIP}`
        },
        meta: {
          timestamp: new Date(),
          requestId: crypto.randomUUID(),
          version: '1.0.0'
        }
      });

    } catch (cloudflareError) {
      console.error('Cloudflare update error:', cloudflareError);
      
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'DNS_UPDATE_FAILED',
          message: `Failed to update DNS record: ${cloudflareError instanceof Error ? cloudflareError.message : 'Unknown error'}`
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error updating subdomain:', error);
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    }, { status: 500 });
  }
}
