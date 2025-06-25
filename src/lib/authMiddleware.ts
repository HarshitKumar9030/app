import { NextRequest, NextResponse } from 'next/server';
import { User, ApiResponse } from '@/types/api';
import AuthService from '@/lib/auth';
import UserRepository from '@/lib/userRepository';

export interface AuthenticatedRequest extends NextRequest {
  user?: User;
}

/**
 * Middleware to authenticate API requests using API keys
 */
export async function authenticateApiKey(
  request: NextRequest
): Promise<{ user: User | null; error: ApiResponse<null> | null }> {
  try {
    const authHeader = request.headers.get('Authorization');
    const apiKey = AuthService.extractApiKey(authHeader);

    if (!apiKey) {
      return {
        user: null,
        error: {
          success: false,
          error: {
            code: 'MISSING_API_KEY',
            message: 'API key is required. Please provide it in the Authorization header as "Bearer <api_key>" or "ApiKey <api_key>"'
          }
        }
      };
    }

    if (!AuthService.isValidApiKeyFormat(apiKey)) {
      return {
        user: null,
        error: {
          success: false,
          error: {
            code: 'INVALID_API_KEY_FORMAT',
            message: 'Invalid API key format'
          }
        }
      };
    }

    const user = await UserRepository.findUserByApiKey(apiKey);

    if (!user) {
      return {
        user: null,
        error: {
          success: false,
          error: {
            code: 'INVALID_API_KEY',
            message: 'Invalid or expired API key'
          }
        }
      };
    }

    if (!user.isActive) {
      return {
        user: null,
        error: {
          success: false,
          error: {
            code: 'ACCOUNT_DEACTIVATED',
            message: 'User account is deactivated'
          }
        }
      };
    }

    // Update last active timestamp
    await UserRepository.updateLastActive(user.id);

    return { user, error: null };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      user: null,
      error: {
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Internal authentication error'
        }
      }
    };
  }
}

/**
 * Create an authenticated API handler wrapper
 */
export function withAuth(
  handler: (request: NextRequest, user: User) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const { user, error } = await authenticateApiKey(request);

    if (error || !user) {
      return NextResponse.json(error, { status: 401 });
    }

    try {
      return await handler(request, user);
    } catch (handlerError) {
      console.error('Handler error:', handlerError);
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        }
      }, { status: 500 });
    }
  };
}

/**
 * Rate limiting for authentication endpoints
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string, 
  maxRequests: number = 5, 
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; resetTime: number } {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean up old entries
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitMap.delete(key);
    }
  }
  
  const current = rateLimitMap.get(identifier);
  
  if (!current || current.resetTime < windowStart) {
    // First request in window or window expired
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, resetTime: now + windowMs };
  }
  
  if (current.count >= maxRequests) {
    // Rate limit exceeded
    return { allowed: false, resetTime: current.resetTime };
  }
  
  // Increment count
  current.count++;
  return { allowed: true, resetTime: current.resetTime };
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const clientIP = request.headers.get('x-client-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (real) {
    return real;
  }
  
  if (clientIP) {
    return clientIP;
  }
  
  return 'unknown';
}

const authMiddleware = {
  authenticateApiKey,
  withAuth,
  checkRateLimit,
  getClientIP
};

export default authMiddleware;
