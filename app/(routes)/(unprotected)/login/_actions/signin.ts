'use server';

import { signIn } from '@/auth';

export async function signinAction(formdata: any) {
	try {
		console.log('formdata', formdata);
		await signIn(formdata);
	} catch (error) {
		console.error(error);
	}
}
