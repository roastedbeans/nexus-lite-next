import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React from 'react';

const UnprotectedLayout = async ({ children }: { children: React.ReactNode }) => {
	const session = await auth();

	if (session) {
		return redirect('account');
	}

	return <main>{children}</main>;
};

export default UnprotectedLayout;
