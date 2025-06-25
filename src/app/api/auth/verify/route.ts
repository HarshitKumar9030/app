import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';
import { withAuth } from '@/lib/authMiddleware';

interface VerifyResponse {
  message: string;
  user: {
    id: string;
    email: string;
    username?: string;
  };
  timestamp: Date;
}

export const GET = withAuth(async (request: NextRequest, user) => {
  const response: VerifyResponse = {
    message: 'API key is valid and authentication successful',
    user: {
      id: user.id,
      email: user.email,
      username: user.username
    },
    timestamp: new Date()
  };

  return NextResponse.json<ApiResponse<VerifyResponse>>({
    success: true,
    data: response,
    meta: {
      timestamp: new Date(),
      requestId: crypto.randomUUID(),
      version: '1.0.0'
    }
  });
});

export const POST = GET; // Allow both GET and POST for testing
