'use client';

import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css";
import createEmotionCache from '../utils/createEmotionCache';
import { CacheProvider } from '@emotion/react';
import { AlphabetProvider } from '../context/AlphabetContext';
import { ThemeProvider } from '../context/ThemeContext'; // Import custom ThemeProvider
import { ContractProvider } from '../context/ContractContext'; // Import ContractProvider
import AlertEvent from '../components/AlertEvent';

const cache = createEmotionCache();


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body >
        <CacheProvider value={cache}>
          <ThemeProvider> {/* Wrap components with custom ThemeProvider */}
            <AlphabetProvider>
              <ContractProvider> {/* Wrap components with ContractProvider */}
                <AlertEvent />
                <Navbar />
                {children}
              </ContractProvider>
            </AlphabetProvider>
          </ThemeProvider>
        </CacheProvider>
      </body>
    </html >
  );
}
