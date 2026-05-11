import React from 'react';
import { motion } from 'framer-motion';

export const AuthBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Cinematic Gradient Overlays */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#0a0a0c]"></div>
      
      {/* Animated Glowing Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [-100, 100, -100],
          y: [-50, 50, -50]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-cortex-accent/20 blur-[120px] rounded-full"
      />
      
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [100, -100, 100],
          y: [50, -50, 50]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[70%] bg-cortex-accent/10 blur-[150px] rounded-full"
      />

      {/* Industrial Grid with Perspective */}
      <div className="absolute inset-0 opacity-[0.15]" 
        style={{ 
          backgroundImage: `linear-gradient(var(--color-cortex-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-cortex-accent) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }}
      ></div>

      {/* Animated Particles / Data Points */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.2,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: [null, "-100%"],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 10
            }}
            className="absolute w-1 h-1 bg-cortex-accent rounded-full shadow-[0_0_10px_var(--color-cortex-accent-glow)]"
          />
        ))}
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 w-full h-[2px] bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.1)] animate-scanline"></div>
      </div>
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }}
      ></div>
    </div>
  );
};
