import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const grant_type = formData.get('grant_type');
		const client_id = formData.get('client_id');
		const client_secret = formData.get('client_secret');

		// Validate client credentials
		const client = await prisma.oAuthClient.findUnique({
			where: { clientId: client_id as string },
		});

		if (!client || client.clientSecret !== client_secret) {
			return NextResponse.json(
				{ error: 'invalid_client', error_description: 'Invalid client credentials' },
				{ status: 401 }
			);
		}

		if (grant_type === 'refresh_token') {
			const refresh_token = formData.get('refresh_token');

			// Find the existing token
			const existingToken = await prisma.oAuthToken.findFirst({
				where: {
					clientId: client_id as string,
					refreshToken: refresh_token as string,
					expiresAt: { gt: new Date() },
				},
			});

			if (!existingToken) {
				return NextResponse.json(
					{ error: 'invalid_grant', error_description: 'Invalid refresh token' },
					{ status: 400 }
				);
			}

			// Generate new tokens
			const newAccessToken = crypto.randomBytes(32).toString('hex');
			const newRefreshToken = crypto.randomBytes(32).toString('hex');
			const expiresIn = 3600; // 1 hour

			// Update the token
			await prisma.oAuthToken.update({
				where: { id: existingToken.id },
				data: {
					accessToken: newAccessToken,
					refreshToken: newRefreshToken,
					expiresAt: new Date(Date.now() + expiresIn * 1000),
				},
			});

			return NextResponse.json({
				access_token: newAccessToken,
				refresh_token: newRefreshToken,
				token_type: 'Bearer',
				expires_in: expiresIn,
			});
		} else if (grant_type === 'password') {
			const username = formData.get('username');
			const password = formData.get('password');

			// Find user
			const user = await prisma.user.findUnique({
				where: { email: username as string },
			});

			if (!user || !user.password) {
				return NextResponse.json({ error: 'invalid_grant', error_description: 'Invalid credentials' }, { status: 401 });
			}

			// In practice, you should hash the password and compare with the stored hash
			if (user.password !== password) {
				return NextResponse.json({ error: 'invalid_grant', error_description: 'Invalid credentials' }, { status: 401 });
			}

			// Generate tokens
			const accessToken = crypto.randomBytes(32).toString('hex');
			const refreshToken = crypto.randomBytes(32).toString('hex');
			const expiresIn = 3600; // 1 hour

			// Save the tokens
			await prisma.oAuthToken.create({
				data: {
					clientId: client_id as string,
					userId: user.id,
					accessToken,
					refreshToken,
					expiresAt: new Date(Date.now() + expiresIn * 1000),
				},
			});

			return NextResponse.json({
				access_token: accessToken,
				refresh_token: refreshToken,
				token_type: 'Bearer',
				expires_in: expiresIn,
			});
		}

		return NextResponse.json(
			{ error: 'unsupported_grant_type', error_description: 'Unsupported grant type' },
			{ status: 400 }
		);
	} catch (error) {
		console.error('Token error:', error);
		return NextResponse.json(
			{ error: 'server_error', error_description: 'An unexpected error occurred' },
			{ status: 500 }
		);
	}
}
