'use client';

import { useTransition } from 'react';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { addToast } from '@heroui/toast';

import FeatureCard from '@/components/ui/feature-card';
import SubmitForm from '@/components/ui/submit-form';
import { useRouter } from '@/i18n/routing';
import { authClient } from '@/libs/auth/client';

const LoginForm = ({ mode = 'sign-in' }: { mode?: 'sign-in' | 'sign-up' }) => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const getCurrentDomain = () => {
		return window.location.origin;
	};

	return (
		<FeatureCard
			aria-label="login-form"
			wrapperProps={{
				className: 'w-full max-w-[500px]',
			}}
			className="prose prose-invert flex w-full max-w-[500px] flex-col items-center justify-center px-1 py-12 sm:px-4"
		>
			{mode === 'sign-in' ? (
				<>
					<h3>Sign in to your account</h3>
					<p className="mb-10 text-center text-xs">to continue to Donkin</p>
					<form
						className="flex w-4/5 flex-col gap-2"
						action={formData =>
							startTransition(async () => {
								const email = formData.get('email');
								const password = formData.get('password');
								if (!email || !password) return;
								await authClient.signIn.email(
									{
										email: email as string,
										password: password as string,
										callbackURL: getCurrentDomain(),
									},
									{
										onSuccess: () => {
											addToast({
												title: 'Sign in successful',
												severity: 'success',
												color: 'success',
											});
										},
										onError: error => {
											addToast({
												title: error.error.message,
												severity: 'danger',
												color: 'danger',
											});
										},
									},
								);
							})
						}
					>
						<Input
							aria-label="email"
							isRequired
							required
							disabled={isPending}
							placeholder="Email"
							type="email"
							name="email"
							className="w-full"
						/>
						<Input
							aria-label="password"
							isRequired
							required
							disabled={isPending}
							placeholder="Password"
							type="password"
							name="password"
							className="w-full"
						/>
						<SubmitForm variant="flat" className="w-full mt-5" isLoading={isPending} color="secondary">
							Sign in
						</SubmitForm>
					</form>
					<Button onPress={() => router.push('/sign-up')} className="w-4/5 mt-10" variant="light" color="default">
						Dont have an account? Sign up
					</Button>
				</>
			) : (
				<>
					<h3>Sign up</h3>
					<p className="mb-10 text-center text-xs">to continue to Donkin</p>
					<form
						className="flex w-4/5 flex-col gap-2"
						action={formData =>
							startTransition(async () => {
								const email = formData.get('email');
								const password = formData.get('password');
								const name = formData.get('name');
								if (!email || !password || !name) return;
								await authClient.signUp.email(
									{
										email: email as string,
										password: password as string,
										name: name as string,
										callbackURL: getCurrentDomain(),
									},
									{
										onSuccess: () => {
											addToast({
												title: 'Sign up successful',
												severity: 'success',
												color: 'success',
											});
										},
										onError: error => {
											addToast({
												title: error.error.message,
												severity: 'danger',
												color: 'danger',
											});
										},
									},
								);
							})
						}
					>
						<Input
							aria-label="email"
							isRequired
							required
							disabled={isPending}
							placeholder="Email"
							type="email"
							name="email"
							className="w-full"
						/>
						<Input
							aria-label="name"
							isRequired
							required
							disabled={isPending}
							placeholder="Name"
							type="text"
							name="name"
							className="w-full"
						/>
						<Input
							aria-label="password"
							isRequired
							required
							disabled={isPending}
							placeholder="Password"
							type="password"
							name="password"
							className="w-full"
						/>
						<SubmitForm variant="flat" color="secondary" className="w-full mt-5" isLoading={isPending}>
							Sign up
						</SubmitForm>
					</form>
					<Button
						aria-label="sign-in"
						onPress={() => router.push('/sign-in')}
						className="w-4/5 mt-10"
						variant="light"
						color="default"
					>
						Already have an account? Sign in
					</Button>
				</>
			)}
		</FeatureCard>
	);
};

export default LoginForm;
