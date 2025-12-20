import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`${className} filter drop-shadow-sm`}
    >
      {/* Outer Border Ring (Subtle) */}
      <circle cx="50" cy="50" r="49" stroke="#E2E8F0" strokeWidth="1" />

      {/* Sectors - Using Arcs for perfect circle segments */}
      
      {/* Top Left - Blue */}
      <path d="M50 50 L50 2 A48 48 0 0 0 2 50 Z" fill="#5C9BFC" />
      
      {/* Top Right - Red */}
      <path d="M50 50 L98 50 A48 48 0 0 0 50 2 Z" fill="#F26B61" />
      
      {/* Bottom Right - Yellow */}
      <path d="M50 50 L50 98 A48 48 0 0 0 98 50 Z" fill="#FCD058" />
      
      {/* Bottom Left - Green */}
      <path d="M50 50 L2 50 A48 48 0 0 0 50 98 Z" fill="#56C688" />
      
      {/* Needle - Dark Navy Kite Shape */}
      <path d="M50 15 L58 50 L50 85 L42 50 Z" fill="#1E293B" />
      
      {/* Center Dot */}
      <circle cx="50" cy="50" r="7" fill="white" />
    </svg>
  );
};
