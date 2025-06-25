import { NextRequest, NextResponse } from 'next/server';
import { RegenerateApiKeyRequest, RegenerateApiKeyResponse, ApiResponse } from '@/types/api';
import AuthService from '@/lib/auth';
import UserRepository from '@/lib/userRepository';
import { checkRateLimit, getClientIP } from '@/lib/authMiddleware';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(`regenerate:${clientIP}`, 3, 60 * 60 * 1000); // 3 attempts per hour
    
    if (!rateLimit.allowed) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many API key regeneration attempts. Please try again later.',
          details: {
            resetTime: new Date(rateLimit.resetTime).toISOString()
          }
        }
      }, { status: 429 });
    }

    // Parse request body
    let body: RegenerateApiKeyRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'INVALID_JSON',
          message: 'Invalid JSON in request body'
        }
      }, { status: 400 });
    }

    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Email and password are required'
        }
      }, { status: 400 });
    }

    // Find user by email
    const user = await UserRepository.findUserByEmail(email);
    if (!user) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      }, { status: 401 });
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'ACCOUNT_DEACTIVATED',
          message: 'Account is deactivated. Please contact support.'
        }
      }, { status: 403 });
    }

    // Verify password
    const isPasswordValid = await AuthService.verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      }, { status: 401 });
    }

    // Generate new API key
    const newApiKey = AuthService.generateApiKey();

    // Update user's API key in database
    const updated = await UserRepository.updateUserApiKey(user.id, newApiKey);
    if (!updated) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: 'Failed to update API key'
        }
      }, { status: 500 });
    }

    // Create response
    const response: RegenerateApiKeyResponse = {
      apiKey: newApiKey,
      message: 'API key regenerated successfully. Please update your CLI configuration.'
    };

    return NextResponse.json<ApiResponse<RegenerateApiKeyResponse>>({
      success: true,
      data: response,
      meta: {
        timestamp: new Date(),
        requestId: crypto.randomUUID(),
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('API key regeneration error:', error);
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'REGENERATION_FAILED',
        message: 'Failed to regenerate API key. Please try again.'
      }
    }, { status: 500 });
  }
}
