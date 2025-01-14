import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request) {
	try {
		const authHeader = req.headers.get('authorization');

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return NextResponse.json(
				{ error: 'invalid_request', error_description: 'Missing or invalid authorization header' },
				{ status: 401 }
			);
		}

		const accessToken = authHeader.split(' ')[1];

		// Find the token in the database
		const token = await prisma.oAuthToken.findFirst({
			where: {
				accessToken,
				expiresAt: { gt: new Date() },
			},
			include: {
				user: true,
			},
		});

		if (!token) {
			return NextResponse.json(
				{ error: 'invalid_token', error_description: 'Token is invalid or expired' },
				{ status: 401 }
			);
		}

		// Return user info
		return NextResponse.json({
			id: token.user.id,
			email: token.user.email,
			name: token.user.name,
		});
	} catch (error) {
		console.error('User info error:', error);
		return NextResponse.json(
			{ error: 'server_error', error_description: 'An unexpected error occurred' },
			{ status: 500 }
		);
	}
}
