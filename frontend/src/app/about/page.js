'use client';

import React from 'react';
import { Typography, Box, Paper, Container, Divider } from '@mui/material';
import TriLetter from '../../components/TriLetter';
import TriText from '../../components/TriText'; // Nuevo componente optimizado
import { styled, keyframes } from '@mui/system';

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

const sectionSpacing = { my: 4 };

const AboutPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Title */}
      <AnimatedTypography variant="h3" component="h1" align="center" gutterBottom delay="0.2s">
        Alphabet History
      </AnimatedTypography>

      {/* The Spark of an Idea */}
      <AnimatedBox sx={sectionSpacing} delay="0.4s">
        <Typography variant="h5" component="h2" gutterBottom>
          The Spark of an Idea
        </Typography>
        <Typography variant="body1" paragraph>
          When I was in my 20s, I was searching for inspiration from Nordic or secret alphabets as a gift. The idea came to me to make a present for a girl. I won&apos;t lie—I was deeply in love with her.
        </Typography>
      </AnimatedBox>

      <Divider sx={sectionSpacing} />

      {/* From Inspiration to Code */}
      <AnimatedBox sx={sectionSpacing} delay="0.6s">
        <Typography variant="h5" component="h2" gutterBottom>
          From Inspiration to Code
        </Typography>
        <Typography variant="body1" paragraph>
          While browsing the internet, I came across something similar. I made some modifications and coded a program in Java to translate the text. (Programmers want things easy and interesting at the same time.)
        </Typography>
      </AnimatedBox>

      <Divider sx={sectionSpacing} />

      {/* A Secret Message of Love */}
      <AnimatedPaper elevation={3} sx={{ ...sectionSpacing, p: 3 }} delay="0.8s">
        <Typography variant="h5" component="h2" gutterBottom>
          A Secret Message of Love
        </Typography>
        <Typography variant="body1" paragraph>
          I wrote her a love letter (the things love makes us do) with the text encoded and included its alphabet. It turned out that the text was quite difficult for her (and for most people), so no one could decipher it.
        </Typography>
      </AnimatedPaper>

      <Divider sx={sectionSpacing} />

      {/* Evolution to a Project */}
      <AnimatedBox sx={sectionSpacing} delay="1s">
        <Typography variant="h5" component="h2" gutterBottom>
          Evolution to a Project
        </Typography>
        <Typography variant="body1" paragraph>
          I started making some modifications in Python until I came up with the idea to start this project. Maybe the community can do something interesting with it.
        </Typography>
      </AnimatedBox>

      <Divider sx={sectionSpacing} />

      {/* A Bittersweet Ending */}
      <AnimatedPaper elevation={3} sx={{ ...sectionSpacing, p: 3, backgroundColor: 'error.light' }} delay="1.2s">
        <Typography variant="h5" component="h2" gutterBottom>
          A Bittersweet Ending
        </Typography>

        <Typography variant="body1" paragraph>
          And if you are asking...
        </Typography>

        {/* Encoded Secret Message */}
        <Box
          sx={{
            mt: 2,
            mb: 2,
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            overflowX: 'hidden',
            width: '100%',
            maxWidth: '100%',
          }}
        >
          <TriText size={30} strokeWidth={5}>
            AFTER ONE YEAR OF BEING
            HER BOYFRIEND, SHE
            CHEATED ON ME WITH
            TWO OTHER GUYS
          </TriText>
        </Box>
        <Typography variant="body1" align="center" sx={{ mt: 2, fontStyle: 'italic' }}>
          &quot;Everything done with love is what endures &quot;
        </Typography>
      </AnimatedPaper>
    </Container>
  );
};

export default AboutPage;
