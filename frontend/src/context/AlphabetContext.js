import React, { createContext, useState, useContext, useEffect } from 'react';

// Top Left to right bottom 
// center is the last one

// [ top left , top right , bottom left , bottom right , center ]
const AlphabetContext = createContext();

export const AlphabetProvider = ({ children }) => {
  const [baseAlphabetConfig] = useState({
    A: [true, true, true, false, true], // Example configuration for 'A'
    B: [true, false, true, false, false], // Example configuration for 'B'
    C: [false, true, false, true, false], // Example configuration for 'C'
    D: [true, true, false, true, true], // Example configuration for 'D'
    E: [true, true, true, true, true], // Example configuration for 'E'

    F: [true, false, false, false, true],
    G: [true, false, true, false, true],
    H: [false, true, false, true, true],
    I: [true, true, true, false, false],
    J: [false, true, false, false, true],

    K: [false, false, true, true, true],
    L: [true, false, false, true, true],
    M: [true, false, true, true, false],
    N: [true, true, true, true, false],
    O: [false, true, true, false, true],

    P: [true, false, false, true, false],
    Q: [true, true, false, false, false],
    R: [true, false, true, true, true],
    S: [false, true, true, true, false],
    T: [false, true, true, true, true],

    U: [true, true, false, false, true],
    V: [true, true, false, true, false],
    W: [false, true, true, false, false],
    X: [false, false, true, true, false],
    Y: [false, false, true, false, true],

    Z: [false, false, false, true, true],
  });

  const [currentAlphabetMapping, setCurrentAlphabetMapping] = useState({});

  useEffect(() => {
    // Initialize currentAlphabetMapping with the default direct mapping
    const initialMapping = {};
    Object.keys(baseAlphabetConfig).forEach(letter => {
      initialMapping[letter] = letter; // Map each letter to itself initially
    });
    setCurrentAlphabetMapping(initialMapping);
  }, [baseAlphabetConfig]); // Depend on baseAlphabetConfig to initialize

  const updateCurrentAlphabetMapping = (newMapping) => {
    setCurrentAlphabetMapping(newMapping);
  };

  // Function to get the config for a letter based on the current mapping
  const getLetterConfig = (letter) => {
    const mappedLetter = currentAlphabetMapping[letter.toUpperCase()];
    return baseAlphabetConfig[mappedLetter] || []; // Return empty array if mapping or config not found
  };

  return (
    <AlphabetContext.Provider value={{ baseAlphabetConfig, currentAlphabetMapping, updateCurrentAlphabetMapping, getLetterConfig }}>
      {children}
    </AlphabetContext.Provider>
  );
};

export const useAlphabet = () => useContext(AlphabetContext);
