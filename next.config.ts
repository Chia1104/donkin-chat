import withBundleAnalyzerImport from '@next/bundle-analyzer';
import { withSentryConfig as withSentryConfigImport } from '@sentry/nextjs';
import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import { env, IS_PRODUCTION } from '@/utils/env';

type Plugin = (config: NextConfig) => NextConfig;

const withBundleAnalyzer = withBundleAnalyzerImport({
	enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin();

const securityHeaders = [
	{
		key: 'X-DNS-Prefetch-Control',
		value: 'on',
	},
	{
		key: 'X-XSS-Protection',
		value: '1; mode=block',
	},
	{
		key: 'X-Frame-Options',
		value: 'SAMEORIGIN',
	},
	{
		key: 'Referrer-Policy',
		value: 'origin-when-cross-origin',
	},
	{
		key: 'X-Content-Type-Options',
		value: 'nosniff',
	},
];

const nextConfig: NextConfig = {
	output: 'standalone',
	reactStrictMode: true,
	transpilePackages: ['@t3-oss/env-nextjs', '@t3-oss/env-core', 'wagmi', '@solana/*'],
	experimental: {
		optimizePackageImports: ['lodash-es'],
		reactCompiler: true,
		webpackBuildWorker: true,
		authInterrupts: true,
	},
	serverExternalPackages: [],
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [],
	},
	async headers() {
		return [
			{
				source: '/:path*',
				headers: securityHeaders,
			},
		];
	},
	rewrites: async () => [
		{
			source: '/sitemap-:id.xml',
			destination: '/sitemap.xml/:id',
		},
		{
			source: '/proxy-api/:path*',
			destination: !IS_PRODUCTION ? `${env.NEXT_PUBLIC_APP_API_HOST}/:path*` : '/proxy-api/:path*',
		},
	],
};

const plugins: Plugin[] = [withBundleAnalyzer];

const nextComposePlugins = plugins.reduce((acc, plugin) => plugin(acc), nextConfig);

export default withSentryConfigImport(withNextIntl(nextComposePlugins), {
	org: process.env.SENTRY_ORG,
	project: process.env.SENTRY_PROJECT,
	authToken: process.env.SENTRY_AUTH_TOKEN,
	silent: true,
	disableLogger: true,
	sourcemaps: {
		deleteSourcemapsAfterUpload: true,
	},
});
