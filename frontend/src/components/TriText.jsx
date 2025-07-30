'use client';

import React, { useMemo } from "react";
import TriLetter from "./TriLetter";

const TriText = ({
    children = '',
    size = 40,
    stroke = 'black',
    strokeWidth = 4,
    lineColor,
}) => {
    if (typeof children !== 'string') return null;

    const charHeight = useMemo(() => size * 1.5, [size]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap' }}>
            {children.split('\n').map((line, lineIndex) => (
                <div
                    key={`line-${lineIndex}`}
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        height: `${charHeight}px`,
                        margin: 0,
                        padding: 0,
                    }}
                >
                    {line.split('').map((char, charIndex) => {
                        const isLetter = /^[A-Z]$/i.test(char);
                        return isLetter ? (
                            <TriLetter
                                key={`char-${lineIndex}-${charIndex}`}
                                char={char}
                                size={size}
                                stroke={stroke}
                                strokeWidth={strokeWidth}
                                lineColor={lineColor}
                            />
                        ) : (
                            <div
                                key={`char-${lineIndex}-${charIndex}`}
                                style={{
                                    width: size,
                                    height: charHeight,
                                    display: 'inline-block',
                                }}
                            >
                                <span
                                    style={{
                                        display: 'inline-block',
                                        width: '100%',
                                        height: '100%',
                                        textAlign: 'center',
                                        lineHeight: `${charHeight}px`,
                                        fontSize: size * 0.9,
                                        fontFamily: 'monospace',
                                        verticalAlign: 'top',
                                        userSelect: 'none',
                                    }}
                                >
                                    {char}
                                </span>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default TriText;
