import React from 'react';
import { motion } from 'framer-motion';

interface AssetIconProps {
  status: 'optimal' | 'warning' | 'critical';
  value?: number;
  isEmergency?: boolean;
}

export const BoilerIllustration: React.FC<AssetIconProps> = ({ status, value = 450 }) => {
  const glowColor = status === 'critical' ? 'var(--color-cortex-danger)' : status === 'warning' ? 'var(--color-cortex-warning)' : 'var(--color-cortex-accent)';
  const heatIntensity = Math.min(1, value / 600);

  return (
    <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
      <defs>
        <radialGradient id="boilerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glowColor} stopOpacity={0.6 * heatIntensity} />
          <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Main Body */}
      <rect x="25" y="20" width="50" height="80" rx="4" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      <rect x="30" y="25" width="40" height="70" rx="2" fill="#0d0d0d" />
      
      {/* Heat Core */}
      <motion.rect 
        x="35" y="30" width="30" height="60" rx="1" 
        fill="url(#boilerGlow)"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Vents */}
      {[0, 1, 2, 3, 4].map(i => (
        <rect key={i} x="35" y={35 + i * 12} width="30" height="2" fill="#222" />
      ))}
      
      {/* Pipes */}
      <path d="M 25 40 L 15 40 M 75 80 L 85 80" stroke="#444" strokeWidth="3" strokeLinecap="round" />
      
      {/* Shimmer Effect (Steam/Heat) */}
      <motion.g
        animate={{ y: [-5, -15], opacity: [0, 0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <path d="M 40 15 Q 45 5 50 15 T 60 15" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
      </motion.g>
    </svg>
  );
};

export const PumpIllustration: React.FC<AssetIconProps & { rpm?: number }> = ({ status, rpm = 3600 }) => {
  const accentColor = status === 'critical' ? 'var(--color-cortex-danger)' : status === 'warning' ? 'var(--color-cortex-warning)' : 'var(--color-cortex-accent)';
  const rotationSpeed = 60 / (rpm / 100); // Inverse for duration

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
      {/* Housing */}
      <circle cx="50" cy="50" r="40" fill="#1a1a1a" stroke="#333" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="32" fill="#0d0d0d" stroke={accentColor} strokeWidth="0.5" opacity="0.3" />
      
      {/* Motor Housing */}
      <rect x="65" y="40" width="25" height="20" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      
      {/* Impeller */}
      <motion.g 
        animate={{ rotate: 360 }}
        transition={{ duration: rotationSpeed, repeat: Infinity, ease: "linear" }}
        style={{ originX: "50px", originY: "50px" }}
      >
        <circle cx="50" cy="50" r="4" fill={accentColor} />
        {[0, 120, 240].map(angle => (
          <path 
            key={angle}
            d="M 50 50 L 50 25 Q 65 25 65 50" 
            transform={`rotate(${angle} 50 50)`}
            fill="none" 
            stroke={accentColor} 
            strokeWidth="3" 
            strokeLinecap="round"
            opacity="0.8"
          />
        ))}
      </motion.g>
      
      {/* Base */}
      <rect x="30" y="85" width="40" height="5" rx="1" fill="#333" />
    </svg>
  );
};

export const VesselIllustration: React.FC<AssetIconProps> = ({ status, value = 450 }) => {
  const accentColor = status === 'critical' ? 'var(--color-cortex-danger)' : status === 'warning' ? 'var(--color-cortex-warning)' : 'var(--color-cortex-accent)';
  const pressurePercent = Math.min(100, (value / 800) * 100);

  return (
    <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-xl">
      {/* Tank Body */}
      <path d="M 30 20 Q 50 10 70 20 L 70 100 Q 50 110 30 100 Z" fill="#1a1a1a" stroke="#333" strokeWidth="1.5" />
      
      {/* Pressure Gauge */}
      <circle cx="50" cy="50" r="15" fill="#0d0d0d" stroke="#444" strokeWidth="1" />
      <motion.path 
        d="M 50 50 L 50 40" 
        stroke={accentColor} 
        strokeWidth="1.5" 
        strokeLinecap="round"
        animate={{ rotate: [-45 + pressurePercent, 45 + pressurePercent] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        style={{ originX: "50px", originY: "50px" }}
      />
      
      {/* Liquid/Gas Fill Visualization */}
      <motion.rect 
        x="35" y="80" width="30" height="15" rx="1"
        fill={accentColor}
        opacity="0.1"
        animate={{ opacity: [0.05, 0.2, 0.05] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Structural Bands */}
      <rect x="30" y="35" width="40" height="2" fill="#222" />
      <rect x="30" y="85" width="40" height="2" fill="#222" />
    </svg>
  );
};

export const ConveyorIllustration: React.FC<AssetIconProps> = ({ status }) => {
  const accentColor = status === 'critical' ? 'var(--color-cortex-danger)' : status === 'warning' ? 'var(--color-cortex-warning)' : 'var(--color-cortex-accent)';

  return (
    <svg viewBox="0 0 140 60" className="w-full h-full drop-shadow-xl">
      {/* Rollers */}
      <circle cx="20" cy="30" r="8" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      <circle cx="120" cy="30" r="8" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      
      {/* Belt */}
      <rect x="20" y="22" width="100" height="16" rx="2" fill="#0d0d0d" stroke="#333" strokeWidth="1" />
      
      {/* Moving Slats */}
      <svg x="20" y="22" width="100" height="16" viewBox="0 0 100 16">
        <motion.g
          animate={{ x: [0, 20] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          {[0, 20, 40, 60, 80, 100].map(x => (
            <rect key={x} x={x - 20} y="0" width="2" height="16" fill={accentColor} opacity="0.3" />
          ))}
        </motion.g>
      </svg>
      
      {/* Support Legs */}
      <rect x="35" y="38" width="4" height="15" fill="#222" />
      <rect x="101" y="38" width="4" height="15" fill="#222" />
      <rect x="30" y="53" width="80" height="2" rx="1" fill="#222" />
    </svg>
  );
};
