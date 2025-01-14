'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { FC } from 'react';

const LoginButton: FC = () => {
	const { data: session, status } = useSession();

	if (status === 'loading') {
		return <div>Loading...</div>;
	}

	if (session) {
		return (
			<div>
				Signed in as {session.user?.email}
				<button
					className='ml-4 px-4 py-2 bg-red-500 text-white rounded'
					onClick={() => signOut()}>
					Sign out
				</button>
			</div>
		);
	}

	return (
		<button
			className='px-4 py-2 bg-blue-500 text-white rounded'
			onClick={() => signIn('custom')}>
			Sign in with Nexus Lite Provider
		</button>
	);
};

export default LoginButton;
