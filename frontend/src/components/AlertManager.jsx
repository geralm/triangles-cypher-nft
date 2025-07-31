'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import { styled, keyframes } from '@mui/system';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/WarningAmber';
import { ethers } from 'ethers';
import { useContract } from '../context/ContractContext';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlert must be used within <AlertProvider>');
  return context;
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledAlert = styled(Alert)(({ index }) => ({
  animation: `${fadeIn} 0.5s ease`,
  marginTop: index > 0 ? 8 : 0,
}));

const iconMapping = {
  success: <CheckIcon fontSize="inherit" />,
  error: <ErrorIcon fontSize="inherit" />,
  info: <InfoIcon fontSize="inherit" />,
  warning: <WarningIcon fontSize="inherit" />,
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const { contract } = useContract();

  const pushAlert = useCallback(({ message, severity = 'info', title }) => {
    setAlerts((prev) => {
      const newAlert = {
        id: Date.now() + Math.random(),
        message,
        severity,
        title: title || severity.charAt(0).toUpperCase() + severity.slice(1),
      };
      const updated = [newAlert, ...prev];
      return updated.slice(0, 3); // Máximo 3 alertas
    });
  }, []);

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  useEffect(() => {
    const timers = alerts.map((alert) =>
      setTimeout(() => removeAlert(alert.id), 5000)
    );
    return () => timers.forEach(clearTimeout);
  }, [alerts]);

  useEffect(() => {
    if (!contract) return;

    const handler = (from, amount, msg) => {
      const ethAmount = ethers.formatEther(amount);
      pushAlert({
        severity: 'success',
        title: 'Donation Received',
        message: `💖 ${ethAmount} ETH from ${from}\n“${msg}”`,
      });
    };

    contract.on('DonationReceived', handler);
    return () => contract.off('DonationReceived', handler);
  }, [contract, pushAlert]);

  return (
    <AlertContext.Provider value={{ pushAlert }}>
      {children}
      <Stack
        spacing={2}
        sx={{
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          width: '90%',
          maxWidth: 400,
        }}
      >
        {alerts.map((alert, i) => (
          <Collapse in key={alert.id}>
            <StyledAlert
              severity={alert.severity}
              iconMapping={iconMapping}
              onClose={() => removeAlert(alert.id)}
              index={i}
            >
              {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
              {alert.message}
            </StyledAlert>
          </Collapse>
        ))}
      </Stack>
    </AlertContext.Provider>
  );
};
