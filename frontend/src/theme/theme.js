import { createTheme } from '@mui/material';

export const createCustomTheme = (mode) => {
  return createTheme({
    palette: {
      mode,
    },
    components: {
      MuiInput: {
        styleOverrides: {
          root: {
            '&::before': {
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.42)' : 'rgba(0, 0, 0, 0.42)',
            },
          },
        },
      },
    },
  });
};