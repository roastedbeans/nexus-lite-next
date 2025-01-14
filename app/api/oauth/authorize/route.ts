import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function GET(req: Request) {
	try {
		const url = new URL(req.url);
		const client_id = url.searchParams.get('client_id');
		const redirect_uri = url.searchParams.get('redirect_uri');
		const response_type = url.searchParams.get('response_type');
		const state = url.searchParams.get('state');

		// Validate required parameters
		if (!client_id || !redirect_uri || response_type !== 'code') {
			return NextResponse.json(
				{ error: 'invalid_request', error_description: 'Missing or invalid parameters' },
				{ status: 400 }
			);
		}

		// Get the current user session
		const session = await auth();

		if (!session?.user) {
			// Store the original request parameters in a cookie
			const authRequest = {
				client_id,
				redirect_uri,
				response_type,
				state,
			};

			cookies().set('auth_request', JSON.stringify(authRequest), {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 600, // 10 minutes
			});

			// Redirect to login page
			const loginUrl = new URL('/auth/nexuslite/login', req.url);
			return NextResponse.redirect(loginUrl);
		}

		// Validate the client
		const client = await prisma.oAuthClient.findUnique({
			where: { clientId: client_id },
		});

		if (!client || client.redirectUri !== redirect_uri) {
			return NextResponse.json(
				{ error: 'invalid_client', error_description: 'Invalid client or redirect URI' },
				{ status: 400 }
			);
		}

		// Generate access token and optional refresh token
		const accessToken = crypto.randomBytes(32).toString('hex');
		const refreshToken = crypto.randomBytes(32).toString('hex');
		const expiresIn = 3600; // 1 hour

		// Save the tokens
		await prisma.oAuthToken.create({
			data: {
				clientId: client_id,
				userId: session.user.id,
				accessToken,
				refreshToken,
				expiresAt: new Date(Date.now() + expiresIn * 1000),
			},
		});

		// Redirect with the tokens
		const redirectUrl = new URL(redirect_uri);
		redirectUrl.searchParams.set('access_token', accessToken);
		redirectUrl.searchParams.set('token_type', 'Bearer');
		redirectUrl.searchParams.set('expires_in', expiresIn.toString());
		redirectUrl.searchParams.set('refresh_token', refreshToken);
		if (state) {
			redirectUrl.searchParams.set('state', state);
		}

		return NextResponse.redirect(redirectUrl);
	} catch (error) {
		console.error('Authorization error:', error);
		return NextResponse.json(
			{ error: 'server_error', error_description: 'An unexpected error occurred' },
			{ status: 500 }
		);
	}
}
