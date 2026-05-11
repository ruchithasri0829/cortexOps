import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
  title?: string;
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  interactive?: boolean;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className = '', 
  glow = false,
  interactive = false,
  action,
  ...props
}) => {
  return (
    <motion.div 
      className={`
        ${interactive ? 'glass-panel-interactive' : 'glass-panel'} 
        rounded-2xl overflow-hidden flex flex-col relative group/card
        ${glow ? 'shadow-[0_0_30px_rgba(0,229,255,0.05)]' : ''}
        ${className}
      `}
      whileHover={interactive ? { y: -4, scale: 1.005 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      {...props}
    >
      {/* Refined Glow Layer */}
      {glow && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-cortex-accent-glow)_0%,_transparent_50%)] opacity-20 pointer-events-none"></div>
      )}
      
      {/* Subtle Shimmer */}
      <div className="absolute inset-0 shimmer pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000"></div>

      {title && (
        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.03] backdrop-blur-md flex items-center justify-between z-10 relative">
          <h3 className="text-xs font-bold tracking-[0.25em] text-white uppercase flex items-center gap-2">
            {glow && <span className="w-1 h-1 rounded-full bg-cortex-accent shadow-[0_0_8px_var(--color-cortex-accent-glow)] animate-pulse"></span>}
            {title}
          </h3>
          {action && <div className="flex items-center">{action}</div>}
        </div>
      )}
      <div className="p-6 relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </motion.div>
  );
};
