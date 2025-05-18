import React, { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create the Theme Context
export const ThemeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light',
});

// Create the Theme Provider component
export const ThemeContextProvider = ({ children }) => {
  // State to hold the current theme mode (light or dark)
  const [mode, setMode] = useState('light');

  // Memoize the theme to avoid unnecessary recalculations
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          // You can define other palette options here for light and dark modes
          // For example:
          // primary: {
          //   main: mode === 'light' ? '#1976d2' : '#90caf9',
          // },
          // secondary: {
          //   main: mode === 'light' ? '#9c27b0' : '#f48fb1',
          // },
          // background: {
          //    default: mode === 'light' ? '#f4f6f8' : '#121212',
          //    paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          // },
        },
        // You can add other theme customizations here (typography, components, etc.)
      }),
    [mode],
  );

  // Memoize the context value
  const themeContextValue = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode: mode,
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline provides a consistent baseline across different browsers */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to easily consume the theme context
export const useThemeContext = () => useContext(ThemeContext); 