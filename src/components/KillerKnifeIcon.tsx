import React from 'react';

interface KillerKnifeIconProps {
  className?: string;
  size?: number;
}

export const KillerKnifeIcon: React.FC<KillerKnifeIconProps> = ({
  className = 'w-6 h-6',
  size = 24,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Blade - Classic Clip-Point Horror Movie Knife */}
      <path
        d="M 9.5 13.5 L 14.5 8.5 C 17.5 5.5, 20.5 3.5, 21.5 2.5 C 21 4.5, 20 7.5, 18 10.5 C 16 13.5, 13.5 15.5, 11 15.5 Z"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Blade bevel / spine reflection line */}
      <path
        d="M 10.5 14 L 17 7.5 C 19 5.5, 20.5 3.8, 21.5 2.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
      {/* Knife Guard / Bolster */}
      <path
        d="M 8 12 L 12.5 16.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Handle with ergonomic contour */}
      <path
        d="M 9 14.5 L 4 19.5 C 3 20.5, 2.5 21.5, 3.5 22.5 C 4.5 23.5, 5.5 23, 6.5 22 L 11.5 17"
        fill="currentColor"
        fillOpacity="0.35"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Handle Rivets / Pins */}
      <circle cx="5.5" cy="20.5" r="0.8" fill="currentColor" />
      <circle cx="8" cy="18" r="0.8" fill="currentColor" />
    </svg>
  );
};
