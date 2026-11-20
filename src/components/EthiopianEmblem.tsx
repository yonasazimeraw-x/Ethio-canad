import React from 'react';

interface EthiopianEmblemProps {
  className?: string;
  size?: number;
}

export const EthiopianEmblem: React.FC<EthiopianEmblemProps> = ({
  className = '',
  size = 76,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="የኢትዮጵያ ፌድሬሽን አርማ"
    >
      <defs>
        <linearGradient id="eth-gold" x1="20" y1="15" x2="100" y2="105" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FCE043" />
          <stop offset="50%" stopColor="#E5A900" />
          <stop offset="100%" stopColor="#B88200" />
        </linearGradient>
        <linearGradient id="eth-green" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#078930" />
          <stop offset="100%" stopColor="#055C20" />
        </linearGradient>
        <linearGradient id="eth-red" x1="0" y1="60" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#DA121A" />
          <stop offset="100%" stopColor="#A60E14" />
        </linearGradient>
      </defs>

      {/* Outer Official Seal Rim */}
      <circle cx="60" cy="60" r="56" fill="#FFFFFF" stroke="url(#eth-gold)" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="51" stroke="#E5E7EB" strokeWidth="1" />

      {/* Tricolor Ceremonial Ring Segments */}
      <path
        d="M15.8 34.5 A51 51 0 0 1 104.2 34.5"
        stroke="url(#eth-green)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M106 43 A51 51 0 0 1 106 77"
        stroke="#FCDD09"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M14 43 A51 51 0 0 0 14 77"
        stroke="#FCDD09"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M21 93 A51 51 0 0 0 99 93"
        stroke="url(#eth-red)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Inner Cobalt/Forest Institutional Core */}
      <circle cx="60" cy="60" r="39" fill="#0A3D24" />
      <circle cx="60" cy="60" r="36" stroke="url(#eth-gold)" strokeWidth="1" strokeOpacity="0.65" />

      {/* Geometric Ethiopian Star Rays */}
      <g stroke="url(#eth-gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polygon
          points="60,27 67.5,49 90.5,49 72,62.5 79,84.5 60,71 41,84.5 48,62.5 29.5,49 52.5,49"
          fill="none"
        />
        <line x1="60" y1="22" x2="60" y2="27" />
        <line x1="94" y1="44" x2="89.5" y2="46.5" />
        <line x1="82" y1="88" x2="79" y2="83.5" />
        <line x1="38" y1="88" x2="41" y2="83.5" />
        <line x1="26" y1="44" x2="30.5" y2="46.5" />
      </g>

      {/* Center Biometric Crest Whorl */}
      <circle cx="60" cy="59" r="14" fill="#072D1A" stroke="url(#eth-gold)" strokeWidth="1.2" />
      <path
        d="M52.5 61.5 C52.5 55.5 55.8 51.5 60 51.5 C64.2 51.5 67.5 55.5 67.5 61.5"
        stroke="#FCE043"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M55.2 63.5 C55.2 58 57.3 54.6 60 54.6 C62.7 54.6 64.8 58 64.8 63.5"
        stroke="#FCE043"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M57.8 65.5 C57.8 61.2 58.8 58 60 58 C61.2 58 62.2 61.2 62.2 65.5"
        stroke="#FCE043"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M60 61.5 V66.8"
        stroke="#FCE043"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
