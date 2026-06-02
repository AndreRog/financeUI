// theme.ts
import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

export const getTheme = (mode: PaletteMode) =>
    createTheme({
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                    // Light theme palette
                    primary: { main: '#1976d2' },
                    secondary: { main: '#f50057' },
                    background: { default: '#f4f6f8', paper: '#ffffff' },
                    text: { primary: '#000000', secondary: '#4f4f4f' },
                }
                : {
                    // Dark theme palette
                    primary: { main: '#90caf9' },
                    secondary: { main: '#f48fb1' },
                    background: { default: '#121212', paper: '#1d1d1d' },
                    text: { primary: '#ffffff', secondary: '#bcbcbc' },
                }),
        },
        typography: {
            fontFamily: `'Roboto', 'Helvetica', 'Arial', sans-serif`,
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        borderRadius: 8,
                    },
                },
            },
        },
    });
