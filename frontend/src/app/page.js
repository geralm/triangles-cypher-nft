'use client';

import { useState, useEffect, useRef } from 'react';
import TriLetter from '../components/TriLetter';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import StarIcon from '@mui/icons-material/Star';
import DescriptionIcon from '@mui/icons-material/Description'; // Import DescriptionIcon
import { useRouter } from 'next/navigation';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import AlphabetMap from '../components/AlphabetMap';
import { styled, keyframes } from '@mui/system';
import { useContract } from '../context/ContractContext';

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

const generateRandomTriLetterText = (length) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return result;
};

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


function Home() {
  const router = useRouter();
  const theme = useTheme();
  const aboutContractRef = useRef(null);
  const [randomFooterText, setRandomFooterText] = useState('');
  const { contract, account, contractData } = useContract();

  useEffect(() => {
    setRandomFooterText(generateRandomTriLetterText(30));
  }, []);

 

  const [displayedText, setDisplayedText] = useState(['', '', '', '', '', '', '', '']);
  const [isEncoded, setIsEncoded] = useState(false);
  const baseText = 'ALPHABET';

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedText((prev) => {
        const newText = [...prev];
        for (let i = 0; i < baseText.length; i++) {
          if (!isEncoded && newText[i] !== baseText[i]) {
            newText[i] = generateRandomTriLetterText(1);
          } else if (isEncoded && newText[i] !== baseText[i]) {
            newText[i] = baseText[i];
          }
        }
        return newText;
      });
    }, 60);

    const toggle = setTimeout(() => setIsEncoded(!isEncoded), 5555);
    return () => {
      clearInterval(interval);
      clearTimeout(toggle);
    };
  }, [isEncoded]);

  const handleLaunchEditor = () => router.push('/editor');
  const handleDonate = () => router.push('/donate');
  const handleBackToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const handleScrollToContract = () => {
    if (aboutContractRef.current) {
      aboutContractRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const movingTexts = ["AS A PRESENT", "        ", "AS A CHALLENGE", "SECRET KNOWLEDGE COMMING SOON..."];

  const handleViewIps = () => {
    // TODO: Replace with the actual URL of the IPS document on the blockchain
    window.open(contractData.baseAlphabetUrl , '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.palette.background.default }}>
      <section className="py-40 text-center" style={{ backgroundColor: theme.palette.navy_blue.main }}>
        <Container maxWidth="md">

          <AnimatedBox delay="0.2s" sx={{ display: 'flex', justifyContent: 'center' }}>
            {displayedText.map((char, idx) => (
              <TriLetter char={char} key={idx} size={40} strokeWidth={9} lineColor={theme.palette.alabaster.main} />
            ))}
          </AnimatedBox>

          <AnimatedTypography delay="0.6s" variant="body1" paragraph sx={{ color: theme.palette.platinum.main, paddingY: 10 }}>
            A symbolic alphabet crafted with precision, creativity, and code. Transform letters into unique triangular symbols and explore a new visual language designed for artistic expression, cryptographic inspiration, and creative storytelling.
          </AnimatedTypography>

          <AnimatedBox delay="1s" sx={{ '& > :not(style)': { m: 1 } }}>
            <Button variant="contained" startIcon={<EditIcon />} onClick={handleLaunchEditor}>Launch Editor</Button>
            <Button variant="contained" startIcon={<AccountBalanceIcon />} onClick={handleScrollToContract}>About The Contract</Button>
          </AnimatedBox>

        </Container>
      </section>

      {/* Section 2: Animated TriLetters Bar */}
      {/* Section 2: Animated TriLetters Bar */}
      <section className="py-4 overflow-hidden" style={{ backgroundColor: theme.palette.secondary.main }}>
        <Box sx={{ position: 'relative', overflow: 'hidden', height: 60 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 6,
              position: 'absolute',
              whiteSpace: 'nowrap',
              animation: 'scrollRight 30s linear infinite',
              '@keyframes scrollRight': {
                '0%': { transform: 'translateX(-100%)' },
                '100%': { transform: 'translateX(100%)' },
              },
            }}
          >
            {[...Array(2)].flatMap((_, i) =>
              movingTexts.map((text, textIndex) => (
                <Box key={`${i}-${textIndex}`} sx={{ display: 'flex', gap: 1 }}>
                  {text.split('').map((char, charIndex) => (
                    <Box
                      key={`${textIndex}-${charIndex}`}
                      sx={{
                        animation: `fade-in 2s ease ${charIndex * 0.1}s forwards`,
                        opacity: 0,
                      }}
                    >
                      <TriLetter char={char} size={30} strokeWidth={7} lineColor={theme.palette.text.primary} />
                    </Box>
                  ))}
                </Box>
              ))
            )}
          </Box>
        </Box>
      </section>



      <section className="py-16 px-4" style={{ backgroundColor: theme.palette.background.paper }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ color: theme.palette.text.primary }}>
            Original Alphabet
          </Typography>
          <AlphabetMap theme={theme} />
        </Container>
      </section>

      <section ref={aboutContractRef} className="py-16 px-4" style={{ backgroundColor: theme.palette.background.paper }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ color: theme.palette.text.primary }}>
            About the Contract
          </Typography>
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>Contract Address:</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ wordBreak: 'break-all' }}>{contractData.address}</Typography>
            <Typography variant="h6" gutterBottom sx={{ mt: 3, color: theme.palette.text.primary }}>Total Donated Amount:</Typography>
            <Typography variant="body1" color="text.secondary">{contractData.totalDonated} ETH</Typography>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              {/* New Button to view Alphabet */}
              <Button
                variant="outlined"
                startIcon={<DescriptionIcon />}
                onClick={handleViewIps}
                sx={{ fontSize: '1.2rem', padding: '12px 24px', marginRight: '16px', color: theme.palette.text.primary, borderColor: theme.palette.text.primary, '&:hover': { borderColor: theme.palette.secondary.dark } }} // Add some margin to the right and set text color
              >
                View Alphabet
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleDonate}
                sx={{ fontSize: '1.2rem', padding: '12px 24px' }} // Increased font size and padding
              >
                Buy Me a Coffee
              </Button>
            </Box>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button variant="outlined" disabled>
                Coming Soon... Mint your own alphabet
              </Button>
            </Box>
          </Paper>
        </Container>
      </section>

      <footer className="py-8 text-center" style={{ backgroundColor: theme.palette.accent.main, color: theme.palette.alabaster.main }}>
        <Container maxWidth="md">
          <Box sx={{ mb: 2 }}>
            <TriLetter size={20} strokeWidth={4} lineColor={theme.palette.alabaster.main}>{randomFooterText}</TriLetter>
          </Box>
          <Button variant="contained" onClick={handleBackToTop} sx={{ mt: 2 }}>Back to Top</Button>
        </Container>
      </footer>
    </div>
  );
}

export default Home;
