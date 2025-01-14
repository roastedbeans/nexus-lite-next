'use client';
import { Input, Button, Card, Link } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';

type SignInFormInputs = {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export default function Signup() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignInFormInputs>();

	const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
		if (data.password !== data.confirmPassword) {
			alert('Passwords do not match');
			return;
		}

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_NEXUSLITE_URL}/api/signup`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: data.username,
					email: data.email,
					password: data.password,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || 'Failed to create account');
			}

			// Redirect to login page after successful signup
			router.push('/auth/nexuslite/login?signup=success');
		} catch (err) {
			alert(err instanceof Error ? err.message : 'An error occurred');
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<Card className='max-w-md w-full p-6 shadow-lg space-y-4'>
				<h2>Register</h2>
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
							type='text'
							label='Username'
							fullWidth
							placeholder='Enter your username'
							isInvalid={errors.username ? true : false}
							errorMessage={errors.username ? errors.username.message : ''}
						/>
					</div>

					{/* Email Input */}
					<div>
						<Input
							{...register('email', {
								required: 'Email is required',
								pattern: {
									value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
									message: 'Enter a valid email address',
								},
							})}
							type='email'
							label='Email'
							fullWidth
							placeholder='Enter your email'
							isInvalid={errors.email ? true : false}
							errorMessage={errors.email ? errors.email.message : ''}
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
					<div>
						<Input
							{...register('confirmPassword', {
								required: 'Password confirmation is required',
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
						{isSubmitting ? 'Signing un...' : 'Signup'}
					</Button>
				</form>
			</Card>
		</div>
	);
}
