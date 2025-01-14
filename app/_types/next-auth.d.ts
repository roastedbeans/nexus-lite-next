import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
	interface Session extends DefaultSession {
		accessToken?: string;
		error?: string;
		userId?: string;
		user?: DefaultUser & {
			id: string;
		};
	}

	interface User extends DefaultUser {
		id: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends DefaultJWT {
		accessToken?: string;
		refreshToken?: string;
		expiresAt?: number;
		userId?: string;
		error?: string;
	}
}
