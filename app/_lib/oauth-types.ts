import { PrismaClient, OAuthClient, OAuthToken, User } from '@prisma/client';

export type { OAuthClient, OAuthToken, User };

// Create an instance of PrismaClient to use in your app
export const prisma = new PrismaClient();
