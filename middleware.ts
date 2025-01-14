import { auth } from './auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
	// Check if it's an API route that needs token validation
	if (request.nextUrl.pathname.startsWith('/api/')) {
		const authHeader = request.headers.get('authorization');

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return NextResponse.json({ error: 'unauthorized', message: 'Missing authorization header' }, { status: 401 });
		}

		// You can add additional token validation here if needed
	}

	// For regular routes, use the auth middleware
	return auth(request as any);
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)', '/api/:path*'],
};

// app/utils/auth.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function validateAccessToken(token: string) {
	try {
		const oauthToken = await prisma.oAuthToken.findFirst({
			where: {
				accessToken: token,
				expiresAt: { gt: new Date() },
			},
			include: {
				user: true,
			},
		});

		if (!oauthToken) {
			return null;
		}

		return {
			userId: oauthToken.userId,
			user: oauthToken.user,
			clientId: oauthToken.clientId,
		};
	} catch (error) {
		console.error('Token validation error:', error);
		return null;
	}
}
