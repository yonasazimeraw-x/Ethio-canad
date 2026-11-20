import React from 'react';
import { RidgePattern } from '../types/fingerprint';

interface FingerprintGraphicProps {
  pattern: RidgePattern;
  state?: 'pending' | 'scanning' | 'completed';
  size?: number;
  className?: string;
}

export const FingerprintGraphic: React.FC<FingerprintGraphicProps> = ({
  pattern,
  state = 'pending',
  size = 96,
  className = '',
}) => {
  const strokeColor =
    state === 'completed'
      ? '#078930'
      : state === 'scanning'
        ? '#059669'
        : '#334155';

  const bgAccent =
    state === 'completed'
      ? 'rgba(7, 137, 48, 0.08)'
      : state === 'scanning'
        ? 'rgba(16, 185, 129, 0.09)'
        : 'rgba(15, 23, 42, 0.03)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Subtle Biometric Oval Pad */}
      <rect
        x="16"
        y="10"
        width="88"
        height="120"
        rx="44"
        fill={bgAccent}
        stroke={state === 'completed' ? 'rgba(7, 137, 48, 0.25)' : 'rgba(148, 163, 184, 0.3)'}
        strokeWidth="1.2"
      />

      {/* Base Shared Outer Epidermal Ridges */}
      <g
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={state === 'pending' ? 0.78 : 0.96}
      >
        <path d="M31 48 C34 26 46 18 60 18 C74 18 86 26 89 48" />
        <path d="M26 70 C26 40 39 25 60 25 C81 25 94 40 94 70" />
        <path d="M26 88 C26 98 29 107 34 114" />
        <path d="M94 88 C94 98 91 107 86 114" />

        {pattern === 'whorl' && (
          <>
            <path d="M33 78 C33 50 44 33 60 33 C76 33 87 50 87 78 C87 95 79 112 69 120" />
            <path d="M40 82 C40 57 48 41 60 41 C72 41 80 57 80 82 C80 96 73 109 62 117" />
            <path d="M47 78 C47 62 52 49 60 49 C68 49 73 62 73 78 C73 91 67 101 58 106" />
            <path d="M53 75 C53 66 56 57 60 57 C64 57 67 66 67 75 C67 83 64 89 60 91 C56 91 53 84 53 75 Z" />
            <path d="M35 96 C38 106 44 114 52 120" />
            <path d="M44 98 C47 107 52 112 56 115" />
          </>
        )}

        {pattern === 'ulnar-loop' && (
          <>
            <path d="M34 98 C34 52 44 33 60 33 C76 33 86 52 86 84 C86 101 80 113 73 120" />
            <path d="M41 105 C41 60 48 41 60 41 C72 41 79 58 79 86 C79 100 73 111 64 119" />
            <path d="M48 111 C48 68 53 49 60 49 C68 49 72 64 72 86 C72 98 67 107 58 115" />
            <path d="M55 113 C55 76 57 58 61 58 C64 58 65 71 65 86 C65 95 62 102 55 107" />
            <path d="M60 66 L59 94" />
          </>
        )}

        {pattern === 'double-loop' && (
          <>
            <path d="M34 90 C34 52 45 33 60 33 C75 33 86 52 86 90" />
            <path d="M40 100 C40 62 49 41 60 41 C71 41 80 62 80 94" />
            <path d="M47 96 C47 72 52 50 61 50 C69 50 73 64 68 78 C64 89 55 92 52 103 C50 109 53 116 61 120" />
            <path d="M54 83 C54 69 57 58 62 58 C66 58 66 69 61 78 C57 85 48 92 44 106 C42 112 45 117 49 120" />
            <path d="M74 92 C74 104 69 113 64 118" />
          </>
        )}

        {pattern === 'tented-arch' && (
          <>
            <path d="M32 82 C36 53 46 34 60 34 C74 34 84 53 88 82" />
            <path d="M34 95 C41 67 50 44 60 44 C70 44 79 67 86 95" />
            <path d="M36 108 C45 84 52 58 60 54 C68 58 75 84 84 108" />
            <path d="M43 116 C51 96 56 78 60 72 C64 78 69 96 77 116" />
            <path d="M60 55 V118" />
            <path d="M51 119 C54 108 57 98 60 93 C63 98 66 108 69 119" />
          </>
        )}

        {pattern === 'radial-loop' && (
          <>
            <path d="M34 84 C34 52 44 33 60 33 C76 33 86 52 86 98" />
            <path d="M41 86 C41 58 48 41 60 41 C72 41 79 60 79 105" />
            <path d="M48 86 C48 64 52 49 60 49 C67 49 72 68 72 111" />
            <path d="M55 86 C55 71 56 58 59 58 C63 58 65 76 65 113" />
            <path d="M60 66 L61 94" />
            <path d="M35 96 C38 106 43 114 49 120" />
          </>
        )}
      </g>
    </svg>
  );
};
