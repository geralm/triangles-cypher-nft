'use client';

import React, { useState, useRef } from 'react';
import { useAlphabet } from '../../context/AlphabetContext';
import TriText from '../../components/TriText';
import Tooltip from '@mui/material/Tooltip';

import {
  Box, Button, TextField, Menu, MenuItem, IconButton, Modal, Typography,
  Divider, Grid, Chip, Slider, Paper
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '@mui/material/styles';
import { styled, keyframes } from '@mui/system';

// Keyframes for pulsing animation
const pulse = keyframes`
  0% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 0.1;
  }
`;

// Styled component for the animated text
const AnimatedWatermark = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '3rem',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  opacity: 0.1,
  animation: `${pulse} 2s ease-in-out infinite`,
  pointerEvents: 'none',
  zIndex: 1,
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
  borderRadius: '8px',
};

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const EditorPage = () => {
  const theme = useTheme();
  const editorRef = useRef(null);
  const alphabetInputRefs = useRef({});
  const { currentAlphabetMapping, updateCurrentAlphabetMapping } = useAlphabet();

  const [editorText, setEditorText] = useState('');
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);
  const [alphabetError, setAlphabetError] = useState('');
  const [letterSize, setLetterSize] = useState(55);
  const [strokeWidth, setStrokeWidth] = useState(5);

  const isExportOpen = Boolean(exportAnchorEl);

  const handleAlphabetInputChange = (letter, value) => {
    const val = value.toUpperCase();
    if (val && !/^[A-Z]$/.test(val)) return;

    const updated = { ...currentAlphabetMapping, [letter]: val };
    const values = Object.values(updated).filter(Boolean);
    const hasDuplicates = new Set(values).size !== values.length;

    if (hasDuplicates) {
      setAlphabetError('Each mapped letter must be unique.');
    } else {
      setAlphabetError('');
      updateCurrentAlphabetMapping(updated);

      const nextIndex = alphabet.indexOf(letter) + 1;
      if (val && nextIndex < alphabet.length) {
        alphabetInputRefs.current[alphabet[nextIndex]]?.focus();
      }
    }
  };

  const handleAlphabetKeyDown = (letter, e) => {
    if (['Backspace', 'Delete'].includes(e.key)) {
      e.preventDefault();
      const updated = { ...currentAlphabetMapping, [letter]: '' };
      updateCurrentAlphabetMapping(updated);
      setAlphabetError('');

      const prev = alphabet[alphabet.indexOf(letter) - 1];
      if (prev) alphabetInputRefs.current[prev]?.focus();
    }
  };

  const handleRandomizeAlphabet = () => {
    const shuffled = [...alphabet].sort(() => 0.5 - Math.random());
    const mapping = Object.fromEntries(alphabet.map((l, i) => [l, shuffled[i]]));
    updateCurrentAlphabetMapping(mapping);
    setAlphabetError('');
    setTimeout(() => alphabetInputRefs.current[alphabet[0]]?.focus(), 0);
  };

  const handleResetAlphabet = () => {
    const mapping = Object.fromEntries(alphabet.map(l => [l, l]));
    updateCurrentAlphabetMapping(mapping);
    setAlphabetError('');
    setTimeout(() => alphabetInputRefs.current[alphabet[0]]?.focus(), 0);
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: theme.palette.background.default }}> {/* Apply themed background here */}
      {/* Display the TriText preview */}
      <Box className="flex-grow overflow-y-auto editor-container" ref={editorRef} sx={{ lineHeight: 0, p: 2, position: 'relative' }}> {/* Add position: 'relative' */}
        {/* Animated Watermark */}
        {!editorText && ( // Conditionally render based on editorText
          <AnimatedWatermark as="div"> {/* Change rendered element to div */}
            <TriText size={55} strokeWidth={5} lineColor={theme.palette.mode === 'dark' ? 'white' : 'black'}>EXPLORE</TriText>
          </AnimatedWatermark>
        )}
        <TriText size={letterSize} strokeWidth={strokeWidth} lineColor={theme.palette.mode === 'dark' ? 'white' : 'black'}>
          {editorText}
        </TriText>
      </Box>

      {/* Text input and export buttons */}
      <Paper
        elevation={4}
        sx={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: 800,
          p: 2,
          zIndex: 10,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <TextField
            fullWidth
            multiline
            variant="standard"
            placeholder="Start typing..."
            value={editorText}
            onChange={(e) => setEditorText(e.target.value)} // ✅ Reflect text changes
            InputProps={{
              disableUnderline: true,
              style: { color: 'inherit' },
            }}
            sx={{
              '.MuiInputBase-root': {
                maxHeight: '100px',
                overflowY: 'auto',
              },
            }}
          />

          <IconButton color="inherit" onClick={() => setIsFormatModalOpen(true)} sx={{ ml: 2 }}>
            <SettingsIcon />
          </IconButton>

          <Button variant="contained" onClick={(e) => setExportAnchorEl(e.currentTarget)} sx={{ ml: 2 }}>
            Export
          </Button>
        </Box>

        <Menu anchorEl={exportAnchorEl} open={isExportOpen} onClose={() => setExportAnchorEl(null)}>
          <Tooltip title="comming soon..." placement="right-start">
            <MenuItem onClick={() => console.log('Export Symbols to PDF')}>symbols to .pdf</MenuItem>
          </Tooltip>
          <Tooltip title="comming soon..." placement="right-start">
            <MenuItem onClick={() => console.log('Export Solution to PDF')}>solution to .pdf</MenuItem>
          </Tooltip>
          <Tooltip title="comming soon..." placement="right-start">
            <MenuItem onClick={() => console.log('Export Alphabet to PDF')}>alphabet to .pdf</MenuItem>
          </Tooltip>
        </Menu>
      </Paper>

      {/* Modal de ajustes de formato */}
      <Modal
        open={isFormatModalOpen}
        onClose={() => {
          setIsFormatModalOpen(false);
          setAlphabetError('');
        }}
        aria-labelledby="format-settings-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>Format Settings</Typography>
          <Paper elevation={4} sx={{ p: 2, mb: 3, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }}>
            <Typography variant="subtitle1">Preview:</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <TriText size={letterSize} strokeWidth={strokeWidth} lineColor={theme.palette.mode === 'dark' ? 'white' : 'black'}>
                TRI
              </TriText>
            </Box>
            <Typography variant="subtitle1">Letter Size</Typography>
            <Slider value={letterSize} onChange={(e, val) => setLetterSize(val)} min={10} max={100} />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Stroke Width</Typography>
            <Slider value={strokeWidth} onChange={(e, val) => setStrokeWidth(val)} min={1} max={10} />
          </Paper>

          <Divider sx={{ my: 2 }}><Chip label="Alphabet" /></Divider>

          {alphabetError && <Typography color="error" variant="body2">{alphabetError}</Typography>}
          <Grid container spacing={1}>
            {alphabet.map((letter) => (
              <Grid item key={letter} xs={0} sx={{ display: 'flex', alignItems: 'center' }}>
                <TriText size={30} strokeWidth={5} lineColor={theme.palette.mode === 'dark' ? 'white' : 'black'}>
                  {letter}
                </TriText>
                <TextField
                  size="small"
                  value={currentAlphabetMapping[letter] || ''}
                  onChange={(e) => handleAlphabetInputChange(letter, e.target.value)}
                  onKeyDown={(e) => handleAlphabetKeyDown(letter, e)}
                  inputRef={(el) => (alphabetInputRefs.current[letter] = el)}
                  inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                  sx={{
                    '.MuiInputBase-input': { p: '8px 4px' },
                    '.MuiOutlinedInput-notchedOutline': { border: 'none' },
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleResetAlphabet} variant="outlined" sx={{ mr: 1 }}>Reset</Button>
            <Button onClick={handleRandomizeAlphabet} disabled variant="outlined" sx={{ mr: 1 }}>Randomize</Button>
            <Button onClick={() => setIsFormatModalOpen(false)} variant="contained">Close</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default EditorPage;
