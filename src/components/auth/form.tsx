'use client';

import { useTransition } from 'react';

import { Input, Button } from '@heroui/react';
import { toast } from 'sonner';

import Card from '@/components/ui/card';
import SubmitForm from '@/components/ui/submit-form';
import { authClient } from '@/features/auth/client';
import { useRouter } from '@/i18n/routing';

const LoginForm = ({ mode = 'sign-in' }: { mode?: 'sign-in' | 'sign-up' }) => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const getCurrentDomain = () => {
		return window.location.origin;
	};

	return (
		<Card
			wrapperProps={{
				className: 'w-full max-w-[500px]',
			}}
			className="prose dark:prose-invert flex w-full max-w-[500px] flex-col items-center justify-center px-1 py-12 sm:px-4"
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
											toast.success('Sign in successful');
										},
										onError: () => {
											toast.error('An error occurred, please try again');
										},
									},
								);
							})
						}
					>
						<Input
							isRequired
							required
							disabled={isPending}
							placeholder="Email"
							type="email"
							name="email"
							className="w-full"
						/>
						<Input
							isRequired
							required
							disabled={isPending}
							placeholder="Password"
							type="password"
							name="password"
							className="w-full"
						/>
						<SubmitForm variant="flat" color="primary" className="w-full mt-5" isLoading={isPending}>
							Sign in
						</SubmitForm>
					</form>
					<Button onPress={() => router.push('/sign-up')} className="w-4/5 mt-10" variant="flat" color="primary">
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
											toast.success('Sign up successful');
										},
										onError: () => {
											toast.error('An error occurred, please try again');
										},
									},
								);
							})
						}
					>
						<Input
							isRequired
							required
							disabled={isPending}
							placeholder="Email"
							type="email"
							name="email"
							className="w-full"
						/>
						<Input
							isRequired
							required
							disabled={isPending}
							placeholder="Name"
							type="text"
							name="name"
							className="w-full"
						/>
						<Input
							isRequired
							required
							disabled={isPending}
							placeholder="Password"
							type="password"
							name="password"
							className="w-full"
						/>
						<SubmitForm variant="flat" color="primary" className="w-full mt-5" isLoading={isPending}>
							Sign up
						</SubmitForm>
					</form>
					<Button onPress={() => router.push('/sign-in')} className="w-4/5 mt-10" variant="flat" color="primary">
						Already have an account? Sign in
					</Button>
				</>
			)}
		</Card>
	);
};

export default LoginForm;
