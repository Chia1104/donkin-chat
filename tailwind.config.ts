import { iconsPlugin, getIconCollections } from '@egoist/tailwindcss-icons';
import { heroui } from '@heroui/theme';
import containerQueries from '@tailwindcss/container-queries';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

import { theme } from './src/themes/tw.theme';

const config = {
	content: [
		'./src/app/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
		'./src/containers/**/*.{js,ts,jsx,tsx}',
		'./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
	theme,
	darkMode: ['class', 'class'],
	plugins: [
		heroui({
			defaultTheme: 'dark',
			defaultExtendTheme: 'dark',
			themes: {
				dark: {
					colors: {
						primary: {
							DEFAULT: 'rgba(53, 205, 255, 1)',
						},
						danger: {
							DEFAULT: '#E75A5B',
						},
						background: {
							DEFAULT: '#FFFFFF14',
						},
						default: {
							DEFAULT: 'rgba(35, 48, 64, 1)',
							400: '#FFFFFF14',
						},
						content1: {
							DEFAULT: 'rgba(21,30,44)',
							300: 'rgba(255, 255, 255, 0.03)',
						},
					},
					layout: {
						borderWidth: {
							medium: '1px',
						},
						radius: {
							small: '4px',
							medium: '8px',
						},
					},
				},
				light: {
					colors: {
						primary: {
							DEFAULT: 'rgba(53, 205, 255, 1)',
						},
						danger: {
							DEFAULT: '#E75A5B',
						},
						background: {
							DEFAULT: '#FFFFFF14',
						},
						default: {
							DEFAULT: 'rgba(35, 48, 64, 1)',
							400: '#FFFFFF14',
						},
						content1: {
							DEFAULT: 'rgba(11,13,26)',
							300: 'rgba(255, 255, 255, 0.03)',
						},
					},
					layout: {
						borderWidth: {
							medium: '1px',
						},
						radius: {
							small: '4px',
							medium: '8px',
						},
					},
				},
			},
		}),
		typography,
		animate,
		containerQueries,
		iconsPlugin({
			collections: getIconCollections(['material-symbols', 'material-symbols-light']),
		}),
	],
} satisfies Config;

export default config;
