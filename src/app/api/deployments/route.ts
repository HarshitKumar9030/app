import { NextRequest, NextResponse } from 'next/server';
import { getCollection, Collections } from '@/lib/mongodb';
import { 
  Deployment, 
  CreateDeploymentRequest, 
  CreateDeploymentResponse, 
  ApiResponse, 
  DeploymentStatus,
  HealthStatus,
  LogLevel
} from '@/types/api';
import { Document } from 'mongodb';
import CloudflareService from '@/lib/cloudflare';

interface DeploymentDocument extends Document {
  id: string;
  userId: string;
  subdomain: string;
  projectName: string;
  status: string;
  url: string;
  gitRepository?: string;
  gitBranch?: string;
  gitCommit?: string;
  framework: string;
  buildCommand?: string;
  outputDirectory?: string;
  environmentVariables?: Record<string, string>;
  deploymentLogs: Array<{
    id: string;
    timestamp: Date;
    level: string;
    message: string;
    source: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  deployedAt?: Date;
  lastHealthCheck?: Date;
  healthStatus: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateDeploymentRequest = await request.json();
    const { 
      projectName, 
      gitRepository, 
      gitBranch, 
      framework, 
      buildCommand, 
      outputDirectory, 
      environmentVariables,
      publicIP,
      // localIP,
      customSubdomain 
    } = body;

    // Validate required fields
    if (!projectName || !framework) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Missing required fields: projectName and framework'
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

    // Generate unique deployment ID
    const deploymentId = crypto.randomUUID();
    
    // For now, we'll use a placeholder userId - in a real app, this would come from authentication
    const userId = 'user_' + crypto.randomUUID().split('-')[0];

    // Create subdomain - use custom subdomain if provided, otherwise generate one
    const cloudflare = new CloudflareService();
    const subdomain = customSubdomain || await cloudflare.generateUniqueSubdomain();
    
    // Create subdomain with the provided public IP or fallback to default
    const targetIP = publicIP || '192.0.2.1';
    const subdomainResponse = await cloudflare.createSubdomain(subdomain, targetIP);

    // Create deployment document
    const deploymentsCollection = await getCollection<DeploymentDocument>(Collections.DEPLOYMENTS);
    
    const deploymentDoc: Omit<Deployment, '_id'> = {
      id: deploymentId,
      userId,
      subdomain,
      projectName,
      status: DeploymentStatus.PENDING,
      url: subdomainResponse.url,
      gitRepository,
      gitBranch: gitBranch || 'main',
      framework,
      buildCommand,
      outputDirectory,
      environmentVariables,
      deploymentLogs: [{
        id: crypto.randomUUID(),
        timestamp: new Date(),
        level: LogLevel.INFO,
        message: `Deployment created with subdomain ${subdomain}${publicIP ? ` pointing to ${publicIP}` : ''}`,
        source: 'system'
      }],
      createdAt: new Date(),
      updatedAt: new Date(),
      healthStatus: HealthStatus.UNKNOWN
    };

    const result = await deploymentsCollection.insertOne(deploymentDoc as DeploymentDocument);
    
    if (!result.acknowledged) {
      await cloudflare.deleteSubdomain(subdomainResponse.cloudflareRecordId);
      throw new Error('Failed to save deployment to database');
    }

    const subdomainsCollection = await getCollection(Collections.SUBDOMAINS);
    await subdomainsCollection.insertOne({
      subdomain,
      userId,
      deploymentId,
      cloudflareRecordId: subdomainResponse.cloudflareRecordId,
      status: subdomainResponse.status,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const response: CreateDeploymentResponse = {
      deployment: {
        ...deploymentDoc,
        _id: result.insertedId.toString()
      },
      subdomain,
      url: subdomainResponse.url
    };

    return NextResponse.json<ApiResponse<CreateDeploymentResponse>>({
      success: true,
      data: response,
      meta: {
        timestamp: new Date(),
        requestId: crypto.randomUUID(),
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('Error creating deployment:', error);
    
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
    const status = searchParams.get('status');
    const framework = searchParams.get('framework');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const deploymentsCollection = await getCollection<DeploymentDocument>(Collections.DEPLOYMENTS);
    
    // Build filter
    const filter: Record<string, unknown> = {};
    if (userId) filter.userId = userId;
    if (status) filter.status = status;
    if (framework) filter.framework = framework;

    // Get total count
    const total = await deploymentsCollection.countDocuments(filter);
    
    // Get deployments with pagination
    const deployments = await deploymentsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json<ApiResponse<{
      deployments: Deployment[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>>({
      success: true,
      data: {
        deployments: deployments.map(doc => ({
          _id: doc._id?.toString(),
          id: doc.id,
          userId: doc.userId,
          subdomain: doc.subdomain,
          projectName: doc.projectName,
          status: doc.status as DeploymentStatus,
          url: doc.url,
          gitRepository: doc.gitRepository,
          gitBranch: doc.gitBranch,
          gitCommit: doc.gitCommit,
          framework: doc.framework,
          buildCommand: doc.buildCommand,
          outputDirectory: doc.outputDirectory,
          environmentVariables: doc.environmentVariables,
          deploymentLogs: doc.deploymentLogs.map(log => ({
            id: log.id,
            timestamp: log.timestamp,
            level: log.level as LogLevel,
            message: log.message,
            source: log.source
          })),
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          deployedAt: doc.deployedAt,
          lastHealthCheck: doc.lastHealthCheck,
          healthStatus: doc.healthStatus as HealthStatus
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      },
      meta: {
        timestamp: new Date(),
        requestId: crypto.randomUUID(),
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('Error fetching deployments:', error);
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    }, { status: 500 });
  }
}
