// pages/_app.js
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "../app/globals.css";

const theme = createTheme({
	palette: {
		mode: "light",
	},
});

function MyApp({ Component, pageProps }) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Component {...pageProps} />
		</ThemeProvider>
	);
}

export default MyApp;
