'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import TriText from './TriText'; // Import TriText instead of TriLetter
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import GitHubIcon from '@mui/icons-material/GitHub';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useContract } from '../context/ContractContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { contract, _, contractData} = useContract();
  const theme = useTheme();

  const handleGithubClick = () => {
    if (contractData.githubRepositoryUrl) {
      window.open(contractData.githubRepositoryUrl, '_blank');
    } else {
      console.warn('GitHub URL not available');
      // Optionally, open a default or show a message
      // window.open('https://github.com/YOUR_DEFAULT_GITHUB_REPO', '_blank');
    }
  };

  return (
    <AppBar position="static" color="secondary" elevation={4}>
      <Toolbar>

        {/* Logo using TriText */}
        <Link href="/" passHref>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: 2 }}>
            <TriText size={26} strokeWidth={9} lineColor={theme.palette.mode === 'dark' ? theme.palette.alabaster.main : theme.palette.eerie_black.main}>
              TRI
            </TriText>
          </Box>
        </Link>

        {/* Navigation links */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          {[
            { href: '/', label: 'Home' },
            { href: '/editor', label: 'Editor' },
            { href: '/about', label: 'About' },
            { href: '/donate', label: 'Buy Me a Coffee' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} passHref>
              <Button color="inherit" sx={{ mx: 1 }}>{label}</Button>
            </Link>
          ))}
        </Box>

        {/* GitHub + Theme toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            aria-label="github" 
            size="large" 
            onClick={handleGithubClick} 
            color="inherit"
            disabled={!contractData.githubRepositoryUrl} // Disable button if URL is not available
            >
            <GitHubIcon fontSize="large" />
          </IconButton>

          <ThemeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
