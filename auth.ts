import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/app/_lib/prisma';
import bcrypt from 'bcrypt';
import { signInSchema } from './app/_lib/zod';
import { ZodError } from 'zod';

export const config = {
	adapter: PrismaAdapter(prisma),
	providers: [
		Credentials({
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},

			authorize: async (credentials): Promise<any> => {
				// console.log('credentials,', credentials);
				// if (!credentials.email || !credentials.password) {
				// 	return null;
				// }

				// try {
				// 	const user = await prisma.user.findUnique({
				// 		where: {
				// 			email: credentials.email as string,
				// 		},
				// 	});

				// 	if (!user?.password) {
				// 		return null;
				// 	}

				// 	const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password);

				// 	if (!isPasswordValid) {
				// 		return null;
				// 	}

				return {
					id: 'cm5vy3uvx0000v0c8k9xjhz0v',
					email: 'client+1@test.com',
					name: '',
				};
				// } catch (error) {
				// 	if (error instanceof ZodError) {
				// 		// Validation error
				// 		return null;
				// 	}
				// }
			},
		}),
	],
	secret: process.env.AUTH_SECRET,
	pages: {
		signIn: '/login',
	},
	session: {
		strategy: 'jwt',
	},
	debug: true,
	callbacks: {
		async jwt({ token }) {
			const db_user = await prisma.user.findUnique({
				where: {
					email: token.email as string,
				},
			});

			if (db_user) {
				token.id = db_user.id;
				token.email = db_user.email;
				token.name = db_user.name;
			}

			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id as string;
				session.user.email = token.email as string;
				session.user.name = token.name as string;
			}
			return session;
		},
		async authorized({ auth, request }) {
			console.log('============================================');
			const isLoggedIn = auth?.user;
			const isOnDashboard = request.nextUrl.pathname.startsWith('/account');
			console.log('auth:', auth, 'isLoggedIn', isLoggedIn, 'isOnDashboard', isOnDashboard);
			if (isOnDashboard) {
				if (isLoggedIn) return true;
				return false;
			} else if (isLoggedIn) {
				return Response.redirect(new URL('/account', request.nextUrl));
			}
			return true;
		},
	},
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
