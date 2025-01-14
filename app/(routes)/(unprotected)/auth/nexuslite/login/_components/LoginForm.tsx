'use client';
import { Input, Button, Card, Link } from '@nextui-org/react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';

type SignInFormInputs = {
	username: string;
	password: string;
};

export default function SignIn() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl') || '/';

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignInFormInputs>();

	const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
		console.log('Form Data:', data);

		// try {
		// 	const response = await fetch('/api/auth/login', {
		// 		method: 'POST',
		// 		headers: { 'Content-Type': 'application/json' },
		// 		body: JSON.stringify(data),
		// 	});
		// 	const result = await response.json();

		// 	if (response.ok) {
		// 		alert('Sign-in successful!');
		// 		router.push('/account');
		// 	} else {
		// 		alert(result.error || 'Sign-in failed!');
		// 	}
		// } catch (error) {
		// 	alert('An error occurred during sign-in.');
		// }
		try {
			// First, get the OAuth tokens using username/password
			const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_NEXUSLITE_URL}/api/token`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: data.username,
					password: data.password,
				}),
			});

			if (!tokenResponse.ok) {
				throw new Error('Invalid credentials');
			}

			const tokens = await tokenResponse.json();

			// Now sign in with NextAuth using the tokens
			const result = await signIn('nexuslite', {
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token,
				redirect: false,
			});

			if (result?.error) {
				alert(result.error || 'Sign-in failed!');
			} else {
				alert('Sign-in successful!');
				router.push('/account');
			}
		} catch (error) {
			alert('An error occurred during sign-in.');
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<Card className='max-w-md w-full p-6 shadow-lg space-y-4'>
				<h2>Login</h2>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-4'>
					{/* Username Input */}
					<div>
						<Input
							{...register('username', {
								required: 'Username is required',
								minLength: {
									value: 8,
									message: 'Username must be at least 8 characters long',
								},
								maxLength: {
									value: 16,
									message: 'Username must be at most 16 characters long',
								},
							})}
							type='username'
							label='Username'
							fullWidth
							placeholder='Enter your username'
							isInvalid={errors.username ? true : false}
							errorMessage={errors.username ? errors.username.message : ''}
						/>
					</div>

					{/* Password Input */}
					<div>
						<Input
							{...register('password', {
								required: 'Password is required',
								pattern: {
									value: /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?=.*\d).*$/,
									message: 'Password must include at least 1 upper case letter, 1 symbol, and 1 number',
								},
								minLength: {
									value: 8,
									message: 'Password must be at least 8 characters long',
								},
								maxLength: {
									value: 16,
									message: 'Password must be at most 16 characters long',
								},
							})}
							type='password'
							label='Password'
							fullWidth
							placeholder='Enter your password'
							isInvalid={errors.password ? true : false}
							errorMessage={errors.password ? errors.password.message : ''}
						/>
					</div>

					{/* Submit Button */}
					<Button
						type='submit'
						fullWidth
						color='primary'
						isLoading={isSubmitting}
						isDisabled={isSubmitting}>
						{isSubmitting ? 'Logging in...' : 'Login'}
					</Button>
				</form>
				<p className='mt-4'>
					Don't have an account? <Link href='/sign-up'>Register</Link>
				</p>

				<button onClick={() => signIn('nexuslite', { callbackUrl: '/account' })}>Sign in with Nexus Lite</button>
			</Card>
		</div>
	);
}
