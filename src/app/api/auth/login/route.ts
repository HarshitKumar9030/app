import { NextRequest, NextResponse } from 'next/server';
import { LoginRequest, LoginResponse, ApiResponse } from '@/types/api';
import AuthService from '@/lib/auth';
import UserRepository from '@/lib/userRepository';
import { checkRateLimit, getClientIP } from '@/lib/authMiddleware';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(`login:${clientIP}`, 5, 15 * 60 * 1000); // 5 attempts per 15 minutes
    
    if (!rateLimit.allowed) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many login attempts. Please try again later.',
          details: {
            resetTime: new Date(rateLimit.resetTime).toISOString()
          }
        }
      }, { status: 429 });
    }

    // Parse request body
    let body: LoginRequest;
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

    // Validate email format
    if (!AuthService.isValidEmail(email)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'INVALID_EMAIL',
          message: 'Invalid email format'
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

    // Update last active timestamp
    await UserRepository.updateLastActive(user.id);

    // Create response (excluding sensitive data)
    const response: LoginResponse = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        apiKey: user.apiKey,
        lastActiveAt: new Date()
      },
      message: 'Login successful'
    };

    return NextResponse.json<ApiResponse<LoginResponse>>({
      success: true,
      data: response,
      meta: {
        timestamp: new Date(),
        requestId: crypto.randomUUID(),
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'LOGIN_FAILED',
        message: 'Login failed. Please try again.'
      }
    }, { status: 500 });
  }
}
