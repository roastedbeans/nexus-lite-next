import NextAuth from 'next-auth';
import type { NextAuthConfig, Session } from 'next-auth';
import type { OAuthConfig } from 'next-auth/providers';
import type { CustomProfile, CustomTokens } from '@/app/_types/nexuslite-provider';

const CustomProvider = {
	id: 'nexuslite',
	name: 'Nexus Lite',
	type: 'oauth',

	clientId: process.env.NEXUSLITE_CLIENT_ID,
	clientSecret: process.env.NEXUSLITE_CLIENT_SECRET,
	token: {
		url: `${process.env.NEXUSLITE_URL}/token`,
	},
	userinfo: {
		url: `${process.env.NEXUSLITE_URL}/userinfo`,
		async request({ tokens }: { tokens: CustomTokens }) {
			const response = await fetch(`${process.env.NEXUSLITE_URL}/userinfo`, {
				headers: {
					Authorization: `Bearer ${tokens.access_token}`,
				},
			});
			if (!response.ok) {
				throw new Error('Failed to fetch user');
			}
			return await response.json();
		},
	},
	profile(profile: CustomProfile) {
		return {
			id: profile.id,
			name: profile.name,
			email: profile.email,
		};
	},
	// Authorization endpoint configuration
	authorization: {
		url: `${process.env.NEXUSLITE_URL}/api/auth/nexuslite/authorize`,
		params: { response_type: 'code' },
	},

	issuer: process.env.NEXUSLITE_URL,
} satisfies OAuthConfig<CustomProfile>;
export const authConfig = {
	providers: [CustomProvider],
	pages: {
		signIn: '/auth/nexuslite/login',
	},
	callbacks: {
		async jwt({ token, user, account }) {
			if (user && account) {
				token.accessToken = account.access_token;
				token.refreshToken = account.refresh_token;
				token.userId = user.id;
			}

			// Check if token needs refresh
			const now = Math.floor(Date.now() / 1000);
			if (token.expiresAt && now > token.expiresAt) {
				try {
					const response = await fetch(`${process.env.NEXUSLITE_URL}/token`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: new URLSearchParams({
							grant_type: 'refresh_token',
							refresh_token: token.refreshToken as string,
							client_id: process.env.NEXUSLITE_CLIENT_ID!,
							client_secret: process.env.NEXUSLITE_CLIENT_SECRET!,
						}),
					});

					const tokens: CustomTokens = await response.json();

					if (!response.ok) throw tokens;

					return {
						...token,
						accessToken: tokens.access_token,
						refreshToken: tokens.refresh_token,
						expiresAt: tokens.expires_at,
					};
				} catch (error) {
					console.error('Error refreshing token:', error);
					return { ...token, error: 'RefreshAccessTokenError' };
				}
			}

			return token;
		},
		async session({ session, token }): Promise<Session> {
			session.accessToken = token.accessToken;
			session.error = token.error;
			session.userId = token.userId as string;

			return session;
		},
	},
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export const authMiddleware = auth;
