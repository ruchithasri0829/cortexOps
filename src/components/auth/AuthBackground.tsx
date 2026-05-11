import React from 'react';
import { motion } from 'framer-motion';

export const AuthBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base */}
      <div className="absolute inset-0 bg-[#04060f]" />

      {/* Left panel ambient glow – cyan */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.3, 0.18] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-[15%] -left-[5%] w-[55%] h-[70%] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.22) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />

      {/* Right panel ambient glow – deep blue */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[65%] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,100,255,0.25) 0%, transparent 70%)', filter: 'blur(100px)' }}
      />

      {/* Orange industrial warmth accent */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.14, 0.08], x: [0, 30, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
        className="absolute top-[30%] left-[35%] w-[30%] h-[40%] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.18) 0%, transparent 70%)', filter: 'blur(90px)' }}
      />

      {/* Fine grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,229,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,1) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 28 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              background: i % 4 === 0 ? 'rgba(255,107,53,0.7)' : 'rgba(0,229,255,0.7)',
              boxShadow: i % 4 === 0
                ? '0 0 8px rgba(255,107,53,0.5)'
                : '0 0 8px rgba(0,229,255,0.5)',
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 8 + (i % 7) * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: (i * 0.4) % 8,
            }}
          />
        ))}
      </div>

      {/* Scanline */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <motion.div
          className="absolute w-full h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.4), transparent)' }}
          animate={{ top: ['-2px', '100vh'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
        />
      </div>
    </div>
  );
};
