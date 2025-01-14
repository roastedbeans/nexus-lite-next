import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
	title: 'NexusLite',
	description: 'Lite Program for Data Centralization',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={` ${poppins.className} antialiased`}>
				<SessionProvider>{children}</SessionProvider>
			</body>
		</html>
	);
}
