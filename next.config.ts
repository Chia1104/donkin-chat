import withBundleAnalyzerImport from '@next/bundle-analyzer';
import { withSentryConfig as withSentryConfigImport } from '@sentry/nextjs';
import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import { env } from '@/utils/env';

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
	transpilePackages: ['@t3-oss/env-nextjs', '@t3-oss/env-core'],
	experimental: {
		optimizePackageImports: ['@heroui/react'],
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
			destination: `${env.NEXT_PUBLIC_APP_AIP_HOST}/:path*`,
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
