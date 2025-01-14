import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
	const session = await auth();

	console.log('session', session);
	if (!session) {
		return redirect('/login');
	}
	return <main>{children}</main>;
};

export default ProtectedLayout;
