import { NextRequest, NextResponse } from 'next/server';
import { SignupRequest, SignupResponse, ApiResponse, User } from '@/types/api';
import AuthService from '@/lib/auth';
import UserRepository from '@/lib/userRepository';
import { checkRateLimit, getClientIP } from '@/lib/authMiddleware';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(`signup:${clientIP}`, 3, 15 * 60 * 1000); // 3 attempts per 15 minutes
    
    if (!rateLimit.allowed) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many signup attempts. Please try again later.',
          details: {
            resetTime: new Date(rateLimit.resetTime).toISOString()
          }
        }
      }, { status: 429 });
    }

    // Parse request body
    let body: SignupRequest;
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

    const { email, password, username } = body;

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

    // Validate password strength
    const passwordValidation = AuthService.validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'WEAK_PASSWORD',
          message: 'Password does not meet security requirements',
          details: {
            errors: passwordValidation.errors
          }
        }
      }, { status: 400 });
    }

    // Validate username if provided
    if (username) {
      const usernameValidation = AuthService.validateUsername(username);
      if (!usernameValidation.valid) {
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: {
            code: 'INVALID_USERNAME',
            message: 'Username does not meet requirements',
            details: {
              errors: usernameValidation.errors
            }
          }
        }, { status: 400 });
      }
    }

    // Check if email already exists
    const existingUser = await UserRepository.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'An account with this email already exists'
        }
      }, { status: 409 });
    }

    // Hash password and generate API key
    const passwordHash = await AuthService.hashPassword(password);
    const apiKey = AuthService.generateApiKey();
    const userId = AuthService.generateUserId();

    // Create user data
    const userData: Omit<User, '_id'> = {
      id: userId,
      email: email.toLowerCase(),
      username: username || undefined,
      passwordHash,
      deployments: [],
      subdomains: [],
      apiKey,
      isActive: true,
      emailVerified: false, // TODO: Implement email verification
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActiveAt: new Date()
    };

    // Create user in database
    const user = await UserRepository.createUser(userData);

    // Create response (excluding sensitive data)
    const response: SignupResponse = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        apiKey: user.apiKey,
        createdAt: user.createdAt
      },
      message: 'Account created successfully'
    };

    return NextResponse.json<ApiResponse<SignupResponse>>({
      success: true,
      data: response,
      meta: {
        timestamp: new Date(),
        requestId: crypto.randomUUID(),
        version: '1.0.0'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'SIGNUP_FAILED',
        message: 'Failed to create account. Please try again.'
      }
    }, { status: 500 });
  }
}
