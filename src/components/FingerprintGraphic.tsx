import React from 'react';

interface FingerprintGraphicProps {
  className?: string;
  opacity?: number;
}

export const FingerprintGraphic: React.FC<FingerprintGraphicProps> = ({
  className = '',
  opacity = 0.45,
}) => {
  return (
    <svg
      viewBox="0 0 200 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="fpGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#dc2626" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#991b1b" stopOpacity="0.5" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g
        stroke="url(#fpGradient)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
        transform="rotate(14 100 130)"
      >
        {/* Core innermost loop */}
        <path d="M 97 125 C 97 112, 103 112, 103 125 C 103 140, 97 150, 97 160" />
        <path d="M 92 135 C 92 116, 99 100, 105 100 C 111 100, 110 116, 110 132 C 110 148, 103 162, 100 172" />
        
        {/* Concentric Loops - Layer 1 */}
        <path d="M 86 145 C 86 120, 92 88, 107 88 C 120 88, 118 118, 118 138 C 118 158, 109 174, 104 186" />
        
        {/* Concentric Loops - Layer 2 */}
        <path d="M 80 155 C 80 124, 85 76, 108 76 C 127 76, 126 116, 126 144 C 126 168, 115 186, 108 200" />
        
        {/* Concentric Loops - Layer 3 */}
        <path d="M 74 165 C 74 128, 77 64, 110 64 C 134 64, 134 112, 134 150 C 134 178, 121 198, 113 214" />
        
        {/* Concentric Loops - Layer 4 */}
        <path d="M 68 175 C 68 132, 70 52, 111 52 C 141 52, 142 108, 142 156 C 142 188, 127 210, 118 228" />

        {/* Concentric Arches - Layer 5 */}
        <path d="M 62 185 C 62 136, 63 40, 112 40 C 148 40, 150 104, 150 162 C 150 198, 133 222, 123 242" />

        {/* Concentric Arches - Layer 6 */}
        <path d="M 56 195 C 56 140, 56 28, 113 28 C 155 28, 158 100, 158 168 C 158 208, 139 234, 128 254" />

        {/* Outer Arches - Layer 7 */}
        <path d="M 50 205 C 50 144, 49 16, 114 16 C 162 16, 166 96, 166 174 C 166 218, 145 244, 133 264" />

        {/* Outer Perimeter - Layer 8 */}
        <path d="M 44 215 C 44 148, 42 4, 115 4 C 169 4, 174 92, 174 180 C 174 226, 151 254, 138 274" />
      </g>
    </svg>
  );
};
