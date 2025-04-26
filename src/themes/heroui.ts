import { heroui } from '@heroui/react';
import type { PluginsConfig } from 'tailwindcss/plugin';

const plugin: PluginsConfig = heroui({
	defaultTheme: 'dark',
	defaultExtendTheme: 'dark',
	themes: {
		dark: {
			colors: {
				primary: {
					DEFAULT: 'rgba(53, 205, 255, 1)',
				},
				secondary: {
					DEFAULT: 'rgba(0, 111, 238, 1)',
				},
				danger: {
					DEFAULT: 'rgba(231, 90, 91, 1)',
				},
				warning: {
					DEFAULT: 'rgba(255, 181, 34, 1)',
				},
				background: {
					DEFAULT: '#FFFFFF14',
				},
				success: {
					DEFAULT: 'rgba(56, 175, 117, 1)',
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
				secondary: {
					DEFAULT: 'rgba(0, 111, 238, 1)',
				},
				danger: {
					DEFAULT: 'rgba(231, 90, 91, 1)',
				},
				warning: {
					DEFAULT: 'rgba(255, 181, 34, 1)',
				},
				success: {
					DEFAULT: 'rgba(56, 175, 117, 1)',
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
});

export default plugin;
