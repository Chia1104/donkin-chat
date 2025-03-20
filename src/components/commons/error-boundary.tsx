'use client';

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

import { captureException } from '@sentry/nextjs';

import { Error } from './error';

interface Props<TError> {
	className?: string;
	children: ReactNode;
	fallback?: (({ error, reset }: { error: TError | null; reset: () => void }) => ReactNode) | ReactNode;
	onError?: (error: TError, errorInfo: ErrorInfo) => void;
	handleRetry?: ({ error, reset }: { error: TError | null; reset: () => void }) => void;
}

interface State<TError> {
	hasError: boolean;
	error: TError | null;
}

export class ErrorBoundary<TError extends Error> extends Component<Props<TError>, State<TError>> {
	public state: State<TError> = {
		hasError: false,
		error: null,
	};

	public static getDerivedStateFromError() {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	public componentDidCatch(error: TError, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);
		this.props.onError?.(error, errorInfo);
		this.setState({ error });
		captureException(error, {
			extra: {
				errorInfo,
			},
		});
	}

	public render() {
		if (this.state.hasError) {
			return (
				<>
					{this.props.fallback ? (
						typeof this.props.fallback === 'function' ? (
							this.props.fallback({
								error: this.state.error,
								reset: () => {
									this.setState({ hasError: false });
									this.props.handleRetry?.({
										error: this.state.error,
										reset: () => this.setState({ hasError: false }),
									});
								},
							})
						) : (
							this.props.fallback
						)
					) : (
						<Error
							error={this.state.error}
							onRetry={() => {
								this.setState({ hasError: false });
								this.props.handleRetry?.({
									error: this.state.error,
									reset: () => this.setState({ hasError: false }),
								});
							}}
						/>
					)}
				</>
			);
		}

		return this.props.children;
	}
}
