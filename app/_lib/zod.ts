import { object, string } from 'zod';

export const signInSchema = object({
	email: string({ required_error: 'Email is required' })
		.email('Email is invalid')
		.min(1, 'Email is required')
		.max(64, 'Email must be less than 64 characters')
		.regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email is invalid'),

	password: string({ required_error: 'Password is required' })
		.min(1, 'Password is required')
		.min(8, 'Password must be more than 8 characters')
		.max(32, 'Password must be less than 32 characters')
		.regex(
			/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?=.*\d).*/,
			'Password must include at least 1 upper case letter, 1 symbol, and 1 number'
		),
});
