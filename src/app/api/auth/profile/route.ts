import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';
import UserRepository from '@/lib/userRepository';
import { withAuth } from '@/lib/authMiddleware';

interface UserProfileResponse {
  user: {
    id: string;
    email: string;
    username?: string;
    createdAt: Date;
    lastActiveAt: Date;
    emailVerified: boolean;
  };
  stats: {
    totalDeployments: number;
    totalSubdomains: number;
    activeDeployments: number;
  };
}

export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    // Get user statistics
    const stats = await UserRepository.getUserStats(user.id);
    
    if (!stats) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      }, { status: 404 });
    }

    // Create response (excluding sensitive data)
    const response: UserProfileResponse = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        lastActiveAt: user.lastActiveAt,
        emailVerified: user.emailVerified
      },
      stats
    };

    return NextResponse.json<ApiResponse<UserProfileResponse>>({
      success: true,
      data: response,
      meta: {
        timestamp: new Date(),
        requestId: crypto.randomUUID(),
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'PROFILE_FETCH_FAILED',
        message: 'Failed to fetch user profile'
      }
    }, { status: 500 });
  }
});
