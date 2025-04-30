import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	// @ts-ignore
	plugins: [react()],
	test: {
		globals: true,
		environment: 'happy-dom',
		passWithNoTests: true,
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			test: path.resolve(__dirname, './__tests__'),
		},
	},
});
