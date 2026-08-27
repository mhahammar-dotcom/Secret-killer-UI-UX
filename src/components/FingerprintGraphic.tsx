import React from 'react';

interface FingerprintGraphicProps {
  className?: string;
  opacity?: number;
  rotation?: string; // e.g. '-rotate-12' or custom angle
}

export const FingerprintGraphic: React.FC<FingerprintGraphicProps> = ({
  className = '',
  opacity = 0.45,
  rotation = 'rotate-[13deg]',
}) => {
  return (
    <div
      className={`relative pointer-events-none select-none flex items-center justify-center ${rotation} ${className}`}
      style={{ opacity }}
    >
      {/* Pure Realistic Forensic Fingerprint - Diagonal angle with glowing red lighting */}
      <img
        src="/images/pure_red_fingerprint.png"
        alt="Forensic Fingerprint"
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain filter drop-shadow-[0_0_18px_rgba(239,68,68,0.85)] brightness-110 contrast-125"
        style={{
          maskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 50%, rgba(0, 0, 0, 0.4) 80%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 50%, rgba(0, 0, 0, 0.4) 80%, transparent 100%)',
        }}
      />
    </div>
  );
};

