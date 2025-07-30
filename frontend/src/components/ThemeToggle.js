'use client';

import React from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon
import { useTheme } from '../context/ThemeContext'; // Import useTheme hook

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default ThemeToggle;
