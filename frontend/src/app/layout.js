'use client';

import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css";
import createEmotionCache from '../utils/createEmotionCache';
import { CacheProvider } from '@emotion/react';
import { AlphabetProvider } from '../context/AlphabetContext';
import { ThemeProvider } from '../context/ThemeContext'; // Import custom ThemeProvider
import { ContractProvider } from '../context/ContractContext'; // Import ContractProvider
import { AlertProvider } from '../components/AlertManager';

const cache = createEmotionCache();


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body >
        <CacheProvider value={cache}>
          <ThemeProvider> {/* Wrap components with custom ThemeProvider */}

            <AlphabetProvider>
              <ContractProvider> {/* Wrap components with ContractProvider */}
                <AlertProvider>

                  <Navbar />
                  {children}
                </AlertProvider>
              </ContractProvider>
            </AlphabetProvider>

          </ThemeProvider>
        </CacheProvider>
      </body>
    </html >
  );
}
