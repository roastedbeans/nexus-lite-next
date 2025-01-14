'use server';

import { signOut } from '@/auth';

export async function signoutAction() {
	try {
		await signOut({ redirect: false, redirectTo: '/login' });
	} catch (error) {
		console.error(error);
	}
}
