import type { Config } from 'tailwindcss';

export const theme = {
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
			sell: {
				DEFAULT: '#C64F52',
				disabled: '#422631',
			},
			buy: {
				DEFAULT: '#329868',
				disabled: '#163C38',
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
						color: '#FFFFFFD9',
						marginTop: '0.8rem',
						marginBottom: '0.8rem',
					},
				},
			},
		},
	},
} satisfies Config['theme'];
