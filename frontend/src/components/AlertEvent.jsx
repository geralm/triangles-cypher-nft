import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CheckIcon from '@mui/icons-material/Check';
import { ethers } from 'ethers';
import { styled, keyframes } from '@mui/system';
import { useContract } from '../context/ContractContext';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
`;

// Styled Alert with conditional animation
const AnimatedAlert = styled(Alert, {
  shouldForwardProp: (prop) => prop !== 'show'
})(({ show }) => ({
  position: 'fixed',
  top: 20,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1500,
  animation: `${show ? fadeIn : fadeOut} 0.5s ease`,
}));

const AlertEvent = ({ externalMessage, handleCloseModal }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState('');
  const { contract } = useContract();

  // Show alert from external props
  useEffect(() => {
    if (externalMessage) {
      setMessage(externalMessage);
      setShowAlert(true);
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [externalMessage]);

  // Listen to DonationReceived event from the smart contract
  useEffect(() => {
    if (!contract) return;

    const handleDonationReceived = (from, amount, msg) => {
      const ethAmount = ethers.formatEther(amount);
      setMessage(`Donation received from ${from} of ${ethAmount} ETH`);
      setShowAlert(true);
      if (handleCloseModal) handleCloseModal();

      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    };

    contract.on('DonationReceived', handleDonationReceived);
    return () => {
      contract.off('DonationReceived', handleDonationReceived);
    };
  }, [contract, handleCloseModal]);

  return showAlert ? (
    <AnimatedAlert
      show={showAlert}
      icon={<CheckIcon fontSize="inherit" />}
      severity="success"
      onClose={() => setShowAlert(false)}
    >
      <AlertTitle>Success</AlertTitle>
      {message}
    </AnimatedAlert>
  ) : null;
};

export default AlertEvent;
