'use client';
import { Button } from '@nextui-org/button';
import React from 'react';
import { signoutAction } from '../_actions/signout';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
	const router = useRouter();
	const handleLogout = async () => {
		signoutAction();
		router.refresh();
	};
	return (
		<Button
			as={Button}
			color='danger'
			onPress={() => handleLogout()}
			variant='flat'>
			Logout
		</Button>
	);
};

export default LogoutButton;
