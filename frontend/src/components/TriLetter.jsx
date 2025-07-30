'use client';

import React from "react";
import { useAlphabet } from '../context/AlphabetContext'; // Custom alphabet hook

// Converts a boolean config array into a single SVG path string
const parseTriLetterConfig = (config) => {
  if (!Array.isArray(config) || config.length !== 5 || config.some(isNaN)) return "";

  const pathMap = [
    "M50 20 L10 80",  // left diagonal
    "M50 20 L90 80",  // right diagonal
    "M10 80 L50 140", // left base to bottom
    "M90 80 L50 140", // right base to bottom
    "M10 80 L90 80",  // horizontal base
  ];

  return config
    .map((active, i) => (active ? pathMap[i] : null))
    .filter(Boolean)
    .join(" ");
};

const TriLetter = ({
  char = '',
  size = 40,
  stroke = "black",
  strokeWidth = 4,
  lineColor,
}) => {
  const { getLetterConfig } = useAlphabet();

  if (typeof char !== 'string' || char.length !== 1) return null;

  const upperChar = char.toUpperCase();
  const isLetter = /^[A-Z]$/.test(upperChar);
  const isSpace = char === ' ';
  const isNewLine = char === '\n';

  // Define exact drawing bounds
  const viewBoxWidth = 80;
  const viewBoxHeight = 120; // Matches Y=20 to Y=140 range of lines
  const color = lineColor || stroke;

  // Handle spaces and line breaks as invisible placeholders
  if (isSpace || isNewLine) {
    return (
      <div
        style={{
          width: size,
          height: size * 1.5,
          display: 'inline-block',
        }}
      />
    );
  }

  // Render a valid letter as SVG
  const config = getLetterConfig(upperChar);
  const d = parseTriLetterConfig(config);

  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox={`0 20 ${viewBoxWidth} ${viewBoxHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'block',
        margin: 0,
        padding: 0,
        overflow: 'visible',
      }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TriLetter;
