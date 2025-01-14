const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
	await prisma.oAuthClient.create({
		data: {
			clientId: process.env.NEXUSLITE_CLIENT_ID!,
			clientSecret: process.env.NEXUSLITE_CLIENT_SECRET!,
			name: 'NexusLite OAuth Client',
			redirectUri: process.env.NEXUSLITE_REDIRECT_URI!,
		},
	});

	console.log('OAuth client seeded!');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
