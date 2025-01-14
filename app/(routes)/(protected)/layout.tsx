import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import NavbarComponent from '@/app/_components/Navbar';

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
	const session = await auth();

	if (!session) {
		return redirect('/login');
	}
	return (
		<main>
			<NavbarComponent />
			<div className='max-w-5xl w-full min-h-screen mx-auto'>{children}</div>
		</main>
	);
};

export default ProtectedLayout;
