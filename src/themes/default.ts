import { createTheme } from '@mui/material/styles';

export const defaultTheme = createTheme({
	typography: {
		button: { fontSize: 14 },
	},
	palette: {
		primary: {
			main: '#FF533D',
			contrastText: '#fff',
		},
	},
});

export default defaultTheme;
