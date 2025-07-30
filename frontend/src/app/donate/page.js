'use client';

import React, { useState, useRef, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import LinearProgress from '@mui/material/LinearProgress';
import { styled, keyframes } from '@mui/system';
import { useContract } from '../../context/ContractContext'; // Import the useContract hook
import { ethers } from 'ethers';
import AlertEvent from '../../components/AlertEvent'; // Import the AlertEvent component
import { useCallback } from 'react';

// Keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedBox = styled(Box)(({ delay }) => ({
  animation: `${slideInUp} 1s ease forwards`,
  animationDelay: delay,
  opacity: 0,
}));

const AnimatedTypography = styled(Typography)(({ delay }) => ({
  animation: `${fadeIn} 1s ease forwards`,
  animationDelay: delay,
  opacity: 0,
}));

const AnimatedPaper = styled(Paper)(({ delay }) => ({
  animation: `${slideInUp} 1s ease forwards`,
  animationDelay: delay,
  opacity: 0,
}));


const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
}));

const DonatePage = () => {
  const [donationAmount, setDonationAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const animationFrameId = useRef(null);
  const startTime = useRef(null);

  const { contract, account, contractData } = useContract();


  const handleDonate = () => {
    if (account && contract) {
      setIsModalOpen(true);
    } else {
      // Prompt user to connect MetaMask if not already connected
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.request({ method: 'eth_requestAccounts' })
          .then(() => {
            // Account connection successful, now open modal
            setIsModalOpen(true);
          })
          .catch((error) => {
            console.error('MetaMask connection failed:', error);
            // Handle connection errors (e.g., show an error message to the user)
          });
      } else {
        console.error('MetaMask not detected');
        // Handle case where provider is not available (e.g., show a message to the user)
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMessage('');
    setIsPressing(false);
    setProgress(0);
    setConfirmed(false);
    cancelAnimationFrame(animationFrameId.current);
    startTime.current = null;
  };

  const handlePressStart = () => {
    if (!confirmed) {
      setIsPressing(true);
      setProgress(0);
      startTime.current = Date.now();
    }
  };

  const handlePressEnd = () => {
    if (!confirmed) {
      setIsPressing(false);
      if (progress < 100) {
        setProgress(0);
        cancelAnimationFrame(animationFrameId.current);
        startTime.current = null;
      }
    }
  };

  const handleConfirmTransaction = useCallback(
    async () => {
      console.log(`Confirming donation of ${donationAmount} ETH with message: ${message}`);
      // TODO: Implement actual web3 transaction logic here using ethers.js
      if (contract && account) {
        try {
          const tx = await contract.donate(message, { value: ethers.parseEther(donationAmount) });
          await tx.wait();
          setConfirmed(true);

          // setTimeout(() => {
          //   handleCloseModal();
          // }, 1000);
        } catch (error) {

          // Handle transaction errors (e.g., show an error message to the user)
        }
      }
    }, []);

const handleAmountChange = (event) => {
  const value = event.target.value;
  const sanitized = value.replace(/[^0-9.]/g, '');
  const valid = sanitized.split('.').length > 2 ? donationAmount : sanitized;
  setDonationAmount(valid);
};

useEffect(() => {
  const updateProgress = () => {
    if (isPressing && startTime.current !== null) {
      const elapsed = Date.now() - startTime.current;
      const newProgress = Math.min((elapsed / 3000) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        handleConfirmTransaction();
      } else {
        animationFrameId.current = requestAnimationFrame(updateProgress);
      }
    }
  };

  if (isPressing) {
    animationFrameId.current = requestAnimationFrame(updateProgress);
  }

  return () => cancelAnimationFrame(animationFrameId.current);
}, [isPressing, handleConfirmTransaction]);



const contractAddress = contractData.address;

return (
  <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
    <AlertEvent message={alertMessage} />

    <AnimatedTypography variant="h4" component="h1" gutterBottom delay="0.2s">
      Support projects
    </AnimatedTypography>
    <AnimatedTypography variant="body1" paragraph color="text.secondary" delay="0.4s">
      Your contribution helps to continue developing and improving. Every bit of Ether makes a difference!
    </AnimatedTypography>

    <AnimatedPaper elevation={3} sx={{ p: 4, mt: 4 }} delay="0.6s">
      <Typography variant="h6" gutterBottom>
        Send ETH Donation
      </Typography>
      <TextField
        label="Amount (ETH)"
        variant="outlined"
        fullWidth
        value={donationAmount}
        onChange={handleAmountChange}
        sx={{ mb: 2 }}
        inputProps={{
          inputMode: 'decimal',
          pattern: '[0-9.]*',
        }}
      />
      <TextField
        label="Message (Optional)"
        variant="outlined"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={!donationAmount || isNaN(parseFloat(donationAmount)) || parseFloat(donationAmount) < 0.000001 || parseFloat(donationAmount) > 1000000000 || !account}
        onClick={handleDonate}
      >
        {account ? 'Donate' : 'Connect MetaMask'}
      </Button>
    </AnimatedPaper>

    <AnimatedBox sx={{ mt: 4 }} delay="0.8s">
      <Typography variant="h6" gutterBottom>
        Donation Address
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
        {contractAddress}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Please ensure you have a web3 wallet (like Metamask) installed and connected to donate.
      </Typography>
      <Typography variant="body1" paragraph color="text.disabled" sx={{ mt: 25 }}>
        More ideas in mind are coming soon...
      </Typography>
    </AnimatedBox>

    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={isModalOpen}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4, textAlign: 'center' }}>
          <Typography variant="h6" component="h2">
            Confirm
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
            You are about to donate: {donationAmount} ETH
          </Typography>
          {message && (
            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
              Message: &quot;{message}&quot;
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={confirmed}
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            onMouseLeave={handlePressEnd}
            sx={{ mt: 3, height: '50px', position: 'relative' }}
          >
            <BorderLinearProgress
              variant="determinate"
              value={progress}
              sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}
            />
            <Typography variant="button" sx={{ zIndex: 1, color: 'white' }}>
              {confirmed ? 'Confirmed' : 'Press and Hold to Confirm'}
            </Typography>
          </Button>
        </Box>
      </Fade>
    </Modal>
  </Container>
);
};

export default DonatePage;
