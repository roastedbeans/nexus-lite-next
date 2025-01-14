import { OAuthToken } from '@prisma/client';

export type OAuthTokenWithClient = OAuthToken & {
	client: {
		clientId: string;
		clientSecret: string;
	};
};
