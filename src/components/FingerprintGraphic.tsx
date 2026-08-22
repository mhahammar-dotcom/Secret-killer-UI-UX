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
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g stroke="url(#fpGradient)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)">
        {/* Core loop 1 */}
        <path d="M100 120 C100 110, 105 105, 100 95 C95 85, 90 95, 90 110 C90 125, 98 135, 100 145" />
        
        {/* Loop 2 */}
        <path d="M93 85 C98 75, 108 75, 110 88 C112 100, 106 115, 106 130 C106 142, 102 152, 94 160" />
        
        {/* Loop 3 */}
        <path d="M86 95 C88 75, 102 65, 118 78 C124 88, 120 108, 118 125 C116 140, 112 155, 102 170" />
        
        {/* Loop 4 */}
        <path d="M80 110 C80 85, 95 55, 125 68 C135 78, 132 102, 130 122 C128 142, 120 162, 108 180" />

        {/* Arch 5 */}
        <path d="M72 125 C72 90, 88 48, 132 58 C144 70, 142 98, 140 120 C138 145, 128 170, 114 192" />

        {/* Arch 6 */}
        <path d="M64 140 C64 95, 80 40, 138 48 C152 60, 152 95, 150 122 C148 152, 135 180, 120 205" />

        {/* Arch 7 */}
        <path d="M56 155 C56 100, 72 32, 145 38 C160 52, 162 92, 160 125 C158 160, 142 192, 125 218" />

        {/* Outer whorl 8 */}
        <path d="M48 170 C48 110, 65 24, 152 30 C168 45, 172 90, 168 130 C164 170, 148 205, 130 230" />

        {/* Outer whorl 9 */}
        <path d="M40 185 C40 120, 58 16, 158 22 C176 38, 180 88, 176 135 C172 180, 154 218, 136 242" />

        {/* Left delta & ridges */}
        <path d="M75 145 C65 160, 52 180, 36 200" />
        <path d="M70 160 C58 180, 46 200, 30 215" />
        <path d="M65 175 C52 195, 40 215, 25 230" />
        <path d="M60 190 C48 210, 35 230, 20 245" />

        {/* Right delta & ridges */}
        <path d="M125 155 C140 175, 155 195, 170 215" />
        <path d="M132 170 C148 190, 162 210, 175 230" />
        <path d="M138 185 C155 205, 168 225, 180 242" />

        {/* Top ridges */}
        <path d="M85 45 C105 25, 130 25, 148 35" />
        <path d="M75 35 C100 12, 138 12, 160 25" />
        <path d="M65 25 C95 2, 145 2, 170 18" />

        {/* Bottom loops */}
        <path d="M85 180 C95 195, 105 210, 112 225" />
        <path d="M92 195 C100 210, 108 225, 115 240" />
        <path d="M78 200 C88 215, 98 230, 105 245" />
      </g>
    </svg>
  );
};
