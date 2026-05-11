import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Shield, BarChart3 } from 'lucide-react';

const features = [
  { icon: Activity, label: 'Real-time Telemetry', sub: 'Live plant monitoring across all nodes' },
  { icon: Zap, label: 'AI-Driven Alerts', sub: 'Predictive fault detection & prioritization' },
  { icon: Shield, label: 'Cortex Shield', sub: 'Zero-trust enterprise security layer' },
  { icon: BarChart3, label: 'Data Intelligence', sub: 'Advanced analytics & trend reconstruction' },
];

const NetworkNode: React.FC<{ cx: number; cy: number; r: number; color: string; delay: number; label?: string }> = ({ cx, cy, r, color, delay, label }) => (
  <g>
    <circle cx={cx} cy={cy} r={r + 6} fill={color} fillOpacity="0.05" />
    <circle cx={cx} cy={cy} r={r} fill="rgba(4,6,15,0.95)" stroke={color} strokeWidth="1.5" strokeOpacity="0.8" />
    <circle cx={cx} cy={cy} r={r * 0.4} fill={color} fillOpacity="0.9">
      <animate attributeName="r" values={`${r * 0.3};${r * 0.55};${r * 0.3}`} dur={`${2.5 + delay}s`} repeatCount="indefinite" />
      <animate attributeName="fill-opacity" values="0.9;0.4;0.9" dur={`${2.5 + delay}s`} repeatCount="indefinite" />
    </circle>
    {label && (
      <text x={cx} y={cy + r + 14} textAnchor="middle" fontSize="7" fill={color} fillOpacity="0.7" fontFamily="monospace" fontWeight="bold" letterSpacing="0.08em">
        {label}
      </text>
    )}
  </g>
);

export const LeftPanel: React.FC = () => {
  const cx = 200, cy = 185, R = 105;
  const satellites = [
    { angle: -90, color: '#00e5ff', label: 'POWER' },
    { angle: -30, color: '#ff6b35', label: 'THERMAL' },
    { angle: 30,  color: '#00e5ff', label: 'PRESSURE' },
    { angle: 90,  color: '#ff6b35', label: 'FLOW' },
    { angle: 150, color: '#00e676', label: 'SAFETY' },
    { angle: -150,color: '#00e5ff', label: 'DATA' },
  ];

  return (
    <div className="relative flex flex-col h-full min-h-screen px-12 py-14 z-10 overflow-hidden">
      {/* Radial glow behind viz */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 70%)' }} />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="flex items-center gap-3 mb-auto"
      >
        <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center"
          style={{ boxShadow: '0 0 20px rgba(0,229,255,0.15)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#00e5ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <span className="text-xl font-light tracking-[0.2em] text-white">
            CORTEX<span className="font-bold text-cyan-400">OPS</span>
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-cyan-500/60">Industrial Intelligence · Live</span>
          </div>
        </div>
      </motion.div>

      {/* Industrial Network Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="flex-1 flex items-center justify-center"
      >
        <svg viewBox="0 0 400 370" className="w-full max-w-[420px] h-auto">
          <defs>
            <filter id="glow-sm">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-lg">
              <feGaussianBlur stdDeviation="8" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Orbit rings */}
          <circle cx={cx} cy={cy} r={R + 28} fill="none" stroke="rgba(0,229,255,0.04)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={R + 14} fill="none" stroke="rgba(0,229,255,0.07)" strokeWidth="0.5" strokeDasharray="3 9" />

          {/* Connection lines */}
          {satellites.map((sat, i) => {
            const rad = (sat.angle * Math.PI) / 180;
            const sx = cx + Math.cos(rad) * R;
            const sy = cy + Math.sin(rad) * R;
            return (
              <line key={i} x1={cx} y1={cy} x2={sx} y2={sy}
                stroke={sat.color} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="4 6" />
            );
          })}

          {/* Data flow pulses */}
          {satellites.map((sat, i) => {
            return (
              <circle key={`p${i}`} r="2.5" fill={sat.color} filter="url(#glow-sm)">
                <animateMotion dur={`${2.8 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`}>
                  <mpath xlinkHref={`#path${i}`} />
                </animateMotion>
                <animate attributeName="opacity" values="0;1;0" dur={`${2.8 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
              </circle>
            );
          })}
          {/* Hidden paths for pulse motion */}
          {satellites.map((sat, i) => {
            const rad = (sat.angle * Math.PI) / 180;
            const ex = cx + Math.cos(rad) * R;
            const ey = cy + Math.sin(rad) * R;
            return <path key={`mp${i}`} id={`path${i}`} d={`M${cx},${cy} L${ex},${ey}`} fill="none" />;
          })}

          {/* Satellite nodes */}
          {satellites.map((sat, i) => {
            const rad = (sat.angle * Math.PI) / 180;
            const sx = cx + Math.cos(rad) * R;
            const sy = cy + Math.sin(rad) * R;
            const lx = cx + Math.cos(rad) * (R + 36);
            const ly = cy + Math.sin(rad) * (R + 36);
            return (
              <g key={`n${i}`}>
                <NetworkNode cx={sx} cy={sy} r={10} color={sat.color} delay={i * 0.3} />
                <text x={lx} y={ly - 4} textAnchor="middle" fontSize="7" fill={sat.color}
                  fillOpacity="0.75" fontFamily="monospace" fontWeight="bold" letterSpacing="0.08em">
                  {sat.label}
                </text>
              </g>
            );
          })}

          {/* Center node */}
          <circle cx={cx} cy={cy} r={42} fill="rgba(0,229,255,0.04)" filter="url(#glow-lg)" />
          <circle cx={cx} cy={cy} r={30} fill="rgba(4,6,15,0.97)" stroke="rgba(0,229,255,0.7)" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r={24} fill="none" stroke="rgba(0,229,255,0.2)" strokeWidth="1" strokeDasharray="4 4">
            <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="10s" repeatCount="indefinite" />
          </circle>
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="9.5" fill="#00e5ff" fontFamily="monospace" fontWeight="bold" letterSpacing="0.12em">CORTEX</text>
          <text x={cx} y={cy + 8} textAnchor="middle" fontSize="9.5" fill="#00e5ff" fontFamily="monospace" fontWeight="bold" letterSpacing="0.12em">CORE</text>
        </svg>
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-light text-white leading-tight mb-2">
          Industrial <span className="font-semibold text-cyan-400">AI Platform</span>
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
          Enterprise-grade intelligence for modern industrial operations. Real-time monitoring, predictive analytics, AI-assisted control.
        </p>
      </motion.div>

      {/* Feature list */}
      <div className="grid grid-cols-2 gap-3">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-2xl"
            style={{ background: 'rgba(0,229,255,0.03)', border: '1px solid rgba(0,229,255,0.07)' }}
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <f.icon size={14} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white/80 tracking-wide">{f.label}</p>
              <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">{f.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
