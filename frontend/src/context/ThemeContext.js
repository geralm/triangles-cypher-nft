'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light'); // 'light' or 'dark'

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Define your custom palette colors
  const customPalette = useMemo(() => ({
    platinum: {
      main: '#cfdbd5', // Using main for default shade
      100: '#25312b',
      200: '#4a6256',
      300: '#6f9281',
      400: '#a0b7ab',
      500: '#cfdbd5',
      600: '#dae3de',
      700: '#e3eae7',
      800: '#ecf1ef',
      900: '#f6f8f7',
    },
    alabaster: {
      main: '#e8eddf', // Using main for default shade
      100: '#323b21',
      200: '#647642',
      300: '#94ab69',
      400: '#becca4',
      500: '#e8eddf',
      600: '#ecf0e5',
      700: '#f1f4eb',
      800: '#f6f8f2',
      900: '#fafbf8',
    },
    saffron: {
      main: '#f5cb5c', // Using main for default shade
      100: '#3f2f04',
      200: '#7f5f08',
      300: '#be8e0c',
      400: '#f1b81d',
      500: '#f5cb5c',
      600: '#f7d67d',
      700: '#f9e09d',
      800: '#fbebbe',
      900: '#fdf5de',
    },
    eerie_black: {
      main: '#242423', // Using main for default shade
      100: '#070707',
      200: '#0e0e0e',
      300: '#161615',
      400: '#1d1d1c',
      500: '#242423',
      600: '#50504f',
      700: '#7d7d7a',
      800: '#a8a8a6',
      900: '#d4d4d3',
    },
    jet: {
      main: '#333533', // Using main for default shade
      100: '#0a0a0a',
      200: '#141514',
      300: '#1e1f1e',
      400: '#282a28',
      500: '#333533',
      600: '#5a5e5a',
      700: '#828782',
      800: '#acafac',
      900: '#d5d7d5',
    },
    navy_blue: { // Added the new color
      main: '#000814',
      100: '#000103',
      200: '#000206',
      300: '#00040a',
      400: '#000610',
      500: '#000814',
      600: '#001128',
      700: '#001a3d',
      800: '#002351',
      900: '#002c66',
    },
  }), []);

  // Create a Material UI theme based on the current mode and custom palette
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...customPalette, // Include custom palette
          primary: {
            main: customPalette.saffron.main, // Use saffron for primary
          },
          secondary: {
            main: mode === 'light' ? customPalette.platinum.main : customPalette.jet.main, // Platinum or Jet for secondary
          },
          background: {
            default: mode === 'light' ? customPalette.alabaster.main : customPalette.eerie_black.main, // Alabaster or Eerie Black for background
            paper: mode === 'light' ? customPalette.alabaster[600] : customPalette.jet[600], // Lighter Alabaster or Jet for modal/paper
          },
          text: {
            primary: mode === 'light' ? customPalette.eerie_black.main : customPalette.alabaster.main, // Eerie Black or Alabaster for text
            secondary: mode === 'light' ? customPalette.jet.main : customPalette.platinum.main, // Jet or Platinum for secondary text
          },
          accent: { // Explicitly define accent
            main: customPalette.jet.main, // Map accent to jet
          },
           alabaster: { // Explicitly define alabaster
            main: customPalette.alabaster.main, // Map alabaster to alabaster
             ...customPalette.alabaster, // Include other shades
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? customPalette.alabaster[600] : customPalette.jet[600], // Apply themed background to Paper
                color: mode === 'light' ? customPalette.eerie_black.main : customPalette.alabaster.main, // Apply themed text color to Paper
              },
            },
          },
           MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? customPalette.platinum.main : customPalette.jet.main, // Apply themed background to AppBar
                color: mode === 'light' ? customPalette.eerie_black.main : customPalette.alabaster.main, // Apply themed text color to AppBar
              },
            },
          },
           MuiButton: {
            styleOverrides: {
              root: ({
                ownerState,
                theme
              }) => ({
                ...(ownerState.variant === 'contained' &&
                  ownerState.color === 'primary' && {
                    backgroundColor: customPalette.saffron.main,
                    color: customPalette.eerie_black.main,
                    '&:hover': {
                      backgroundColor: customPalette.saffron[700],
                    },
                  }),
                 ...(ownerState.variant === 'outlined' &&
                  ownerState.color === 'primary' && {
                    color: customPalette.saffron.main,
                    borderColor: customPalette.saffron.main,
                    '&:hover': {
                      borderColor: customPalette.saffron[700],
                      backgroundColor: 'rgba(245, 203, 92, 0.1)', // Example hover with opacity
                    },
                  }),
              }),
            },
          },
           MuiIconButton: {
            styleOverrides: {
              root: ({
                ownerState,
                theme
              }) => ({
                ...(ownerState.color === 'inherit' &&
                  theme.palette.mode === 'dark' && {
                    color: customPalette.alabaster.main,
                  }),
                 ...(ownerState.color === 'inherit' &&
                  theme.palette.mode === 'light' && {
                    color: customPalette.eerie_black.main,
                  }),
              }),
            },
          },
           MuiTextField: {
            styleOverrides: {
              root: ({
                ownerState,
                theme
              }) => ({
                '.MuiInputBase-input': {
                  color: theme.palette.text.primary, // Use themed text color
                },
                 '.MuiOutlinedInput-notchedOutline': {
                   borderColor: theme.palette.text.primary, // Use themed text color for border
                 },
                 '.MuiInputLabel-root': {
                    color: theme.palette.text.secondary, // Use themed secondary text color for label
                 },
              }),
            },
          },
           MuiSlider: {
            styleOverrides: {
              thumb: {
                backgroundColor: customPalette.saffron.main, // Use saffron for slider thumb
              },
              track: {
                backgroundColor: customPalette.saffron[700], // Use a darker shade of saffron for slider track
              },
              rail: {
                backgroundColor: mode === 'light' ? customPalette.eerie_black[300] : customPalette.alabaster[300], // Use a contrasting color for slider rail
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
