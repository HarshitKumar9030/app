import { NextResponse } from 'next/server';
import { healthCheck as mongoHealthCheck } from '@/lib/mongodb';
import CloudflareService from '@/lib/cloudflare';
import { HealthCheckResponse, ServiceHealth, ApiResponse } from '@/types/api';

const startTime = Date.now();

export async function GET() {
  const checkStartTime = Date.now();
  
  try {
    const mongoStart = Date.now();
    const mongoHealthy = await mongoHealthCheck();
    const mongoResponseTime = Date.now() - mongoStart;

    const cloudflareStart = Date.now();
    let cloudflareHealthy = false;
    let cloudflareError = '';
    try {
      const cloudflare = new CloudflareService();
      cloudflareHealthy = await cloudflare.healthCheck();
      if (!cloudflareHealthy) {
        cloudflareError = 'Health check returned false';
      }
    } catch (error) {
      cloudflareError = error instanceof Error ? error.message : 'Unknown error';
      console.error('Cloudflare health check error:', error);
    }
    const cloudflareResponseTime = Date.now() - cloudflareStart;

    const apiResponseTime = Date.now() - checkStartTime;

    const services = {
      database: {
        status: mongoHealthy ? 'up' : 'down',
        responseTime: mongoResponseTime,
        lastCheck: new Date(),
        message: mongoHealthy ? 'Connected' : 'Connection failed'
      } as ServiceHealth,
      
      cloudflare: {
        status: cloudflareHealthy ? 'up' : 'down',
        responseTime: cloudflareResponseTime,
        lastCheck: new Date(),
        message: cloudflareHealthy ? 'API accessible' : (cloudflareError || 'API unreachable')
      } as ServiceHealth,
      
      api: {
        status: 'up',
        responseTime: apiResponseTime,
        lastCheck: new Date(),
        message: 'API responding'
      } as ServiceHealth
    };

    const allServicesUp = Object.values(services).every(service => service.status === 'up');
    const someServicesDown = Object.values(services).some(service => service.status === 'down');
    
    let overallStatus: 'healthy' | 'unhealthy' | 'degraded';
    if (allServicesUp) {
      overallStatus = 'healthy';
    } else if (someServicesDown) {
      overallStatus = 'unhealthy';
    } else {
      overallStatus = 'degraded';
    }

    const healthResponse: HealthCheckResponse = {
      status: overallStatus,
      timestamp: new Date(),
      services,
      uptime: Math.floor((Date.now() - startTime) / 1000),
      version: process.env.npm_package_version || '1.0.0'
    };

    const httpStatus = overallStatus === 'healthy' ? 200 : 503;

    return NextResponse.json<ApiResponse<HealthCheckResponse>>({
      success: overallStatus !== 'unhealthy',
      data: healthResponse,
      meta: {
        timestamp: new Date(),
        requestId: crypto.randomUUID(),
        version: '1.0.0'
      }
    }, { status: httpStatus });

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: error instanceof Error ? error.message : 'Health check failed'
      }
    }, { status: 500 });
  }
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
