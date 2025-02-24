import { heroui } from '@heroui/react';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
	content: [
		'./src/app/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
		'./src/containers/**/*.{js,ts,jsx,tsx}',
		'./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#FF533D',
				},
				success: {
					DEFAULT: '#4caf50',
					light: '#80e27e',
					dark: '#087f23',
					transparent: 'rgba(76,175,80,0.75)',
				},
				info: {
					DEFAULT: '#2196f3',
					light: '#6ec6ff',
					dark: '#0069c0',
					transparent: 'rgba(33,150,243,0.75)',
				},
				warning: {
					DEFAULT: '#ff9800',
					light: '#ffc947',
					dark: '#c66900',
					transparent: 'rgba(255,152,0,0.75)',
				},
				danger: {
					DEFAULT: '#ff4056',
					light: '#ff7961',
					dark: '#ba000d',
					transparent: 'rgba(244,67,54,0.75)',
				},
				root: {
					DEFAULT: '#101010',
				},
				light: {
					DEFAULT: '#fafafa',
					light: '#ffffff',
					dark: '#c7c7c7',
					transparent: 'rgba(250,250,250,0.75)',
				},
				dark: {
					DEFAULT: '#212121',
					light: '#484848',
					dark: '#000000',
					transparent: 'rgba(33,33,33,0.75)',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
		},
	},
	darkMode: ['class', 'class'],
	plugins: [
		heroui({
			defaultTheme: 'dark',
			defaultExtendTheme: 'dark',
			themes: {
				dark: {
					colors: {
						primary: {
							DEFAULT: '#FF533D',
						},
						danger: {
							DEFAULT: '#FF4056',
						},
						background: {
							DEFAULT: '#121213',
						},
						// content1: {
						// 	DEFAULT: '#292828',
						// },
					},
				},
				light: {
					colors: {
						primary: {
							DEFAULT: '#FF533D',
						},
						danger: {
							DEFAULT: '#FF4056',
						},
						background: {
							DEFAULT: '#121213',
						},
						// content1: {
						// 	DEFAULT: '#292828',
						// },
					},
				},
			},
		}),
		typography,
		animate,
	],
};

export default config;
