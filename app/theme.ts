'use client';

import { Roboto } from 'next/font/google';

import { createTheme, ThemeOptions } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Force light mode configuration
const lightModeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#00e5bf',
      light: '#33eacc',
      dark: '#00a086',
      contrastText: '#000000',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@media (prefers-color-scheme: dark)': {
          'html, body': {
            backgroundColor: '#ffffff',
            color: '#000000',
          },
        },
        html: {
          colorScheme: 'light',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { severity: 'info' },
              style: {
                backgroundColor: '#60a5fa',
              },
            },
          ],
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#000000',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#000000',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          color: '#000000',
        },
      },
    },
  },
};

const theme = createTheme(lightModeOptions);

export default theme;
