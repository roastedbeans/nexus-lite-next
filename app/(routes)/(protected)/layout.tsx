import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const ProtectedLayout = async (children: React.ReactNode) => {
	const session = await auth();

	if (!session) {
		return redirect('/auth/nexuslite/login');
	}
	return <main>{children}</main>;
};

export default ProtectedLayout;
