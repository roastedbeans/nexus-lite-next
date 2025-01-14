'use server';

import { signIn } from '@/auth';

export async function signinAction(formdata: any) {
	try {
		await signIn('credentials', { ...formdata, redirect: true, redirectTo: '/account' });
		return formdata;
	} catch (error) {
		console.error(error);
	}
}
