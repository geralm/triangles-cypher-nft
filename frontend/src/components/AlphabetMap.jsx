import React from 'react';
import { Grid, Box, Typography, useTheme } from '@mui/material';
import TriLetter from './TriLetter';

const AlphabetMap = () => {
  const theme = useTheme();
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return (
    <Box sx={{ flexGrow: 2, p: 2 }}>
      <Grid container spacing={1.5}>
        {alphabet.split('').map((letter) => (
          <Grid item xs={12} sm={4} key={letter}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '2px solid',
                borderColor: theme.palette.divider,
                borderRadius: '9px',
                p: 5,
                height: '80px',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TriLetter char={letter} size={35} strokeWidth={4} lineColor={theme.palette.text.primary}>

                </TriLetter>
                <Typography variant="h6" sx={{ ml: 2, color: theme.palette.text.primary }}>
                  {letter}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AlphabetMap;