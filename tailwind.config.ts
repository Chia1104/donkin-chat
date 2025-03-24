import { heroui } from '@heroui/theme';
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
					DEFAULT: 'rgba(53, 205, 255, 1)',
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
					DEFAULT: '#E75A5B',
					light: '#ff7961',
					dark: '#ba000d',
					transparent: 'rgba(244,67,54,0.75)',
				},
				root: {
					DEFAULT: 'rgba(10, 24, 42, 1)',
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
				description: {
					DEFAULT: 'rgba(255, 255, 255, 0.45)',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			typography: {
				DEFAULT: {
					css: {
						p: {
							color: '#FFFFFF73',
						},
					},
				},
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
	],
};

export default config;
