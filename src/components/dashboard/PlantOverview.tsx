import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';
import { Thermometer, Gauge, Activity, Settings } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { 
  BoilerIllustration, 
  PumpIllustration, 
  VesselIllustration, 
  ConveyorIllustration 
} from './AssetIllustrations';

interface Asset {
  id: string;
  name: string;
  status: 'optimal' | 'warning' | 'critical';
  metrics: {
    temp?: number;
    pressure?: number;
    rpm?: number;
    vibration?: number;
    efficiency?: number;
  };
  x: number;
  y: number;
}

const INITIAL_ASSETS: Asset[] = [
  { id: 'boiler', name: 'Main Boiler', status: 'optimal', metrics: { temp: 450, pressure: 120, efficiency: 98 }, x: 25, y: 35 },
  { id: 'vessel', name: 'Pressure Vessel', status: 'optimal', metrics: { pressure: 450, temp: 120 }, x: 75, y: 35 },
  { id: 'pump', name: 'Cooling Pump', status: 'optimal', metrics: { rpm: 3600, vibration: 1.2, temp: 45 }, x: 50, y: 65 },
  { id: 'conveyor', name: 'Conveyor Belt', status: 'optimal', metrics: { rpm: 120, efficiency: 95 }, x: 50, y: 85 },
];

export const PlantOverview: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const { isEmergency, focusedAssetId, setFocusedAssetId, t } = useUiStore();

  // Real-time telemetry simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => {
        const jitter = (val: number, variance: number) => val + (Math.random() - 0.5) * variance;

        let newStatus = asset.status;
        const newMetrics = { ...asset.metrics };

        if (isEmergency) {
          // Emergency override logic
          if (asset.id === 'pump') {
            newStatus = 'critical';
            newMetrics.temp = jitter(newMetrics.temp! > 90 ? newMetrics.temp! : 95, 2);
            newMetrics.vibration = jitter(newMetrics.vibration! > 4 ? newMetrics.vibration! : 4.5, 0.5);
            newMetrics.rpm = jitter(1200, 200); // erratic
          } else if (asset.id === 'vessel') {
            newStatus = 'critical';
            newMetrics.pressure = jitter(newMetrics.pressure! > 600 ? newMetrics.pressure! : 650, 20); // Spiking
          } else {
            // Keep others relatively stable but mark as optimal (faded)
            newStatus = 'optimal';
          }
        } else {
          // Normal logic
          if (asset.id === 'boiler') {
            newMetrics.temp = jitter(newMetrics.temp || 450, 8);
            newMetrics.pressure = jitter(newMetrics.pressure || 120, 3);
            if (newMetrics.temp > 465) newStatus = 'critical';
            else if (newMetrics.temp > 458) newStatus = 'warning';
            else newStatus = 'optimal';
          }
          if (asset.id === 'pump') {
            newMetrics.vibration = Math.max(0, jitter(newMetrics.vibration || 1.2, 0.4));
            newMetrics.rpm = jitter(newMetrics.rpm || 3600, 50);
            if (newMetrics.vibration > 1.8) newStatus = 'warning';
            else newStatus = 'optimal';
          }
          if (asset.id === 'vessel') {
            newMetrics.pressure = jitter(newMetrics.pressure || 450, 15);
            if (newMetrics.pressure > 470) newStatus = 'warning';
            else newStatus = 'optimal';
          }
          if (asset.id === 'conveyor') {
            newMetrics.efficiency = Math.min(100, Math.max(0, jitter(newMetrics.efficiency || 95, 2)));
          }
        }

        return { ...asset, status: newStatus, metrics: newMetrics };
      }));
    }, 1000); // 1-second ticks
    return () => clearInterval(interval);
  }, [isEmergency]);

  return (
    <div className={`grid grid-cols-1 ${isEmergency ? 'lg:grid-cols-1 xl:grid-cols-1' : 'lg:grid-cols-3'} gap-6 h-full transition-all duration-700`}>
      <motion.div className={isEmergency ? 'col-span-1' : 'lg:col-span-2'} layout>
        <Card title={t('plantOverview')} className="h-full min-h-[400px]" glow>
          <div className="relative w-full h-full min-h-[350px] bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center p-2 transition-colors duration-700">
            <div className={`absolute inset-0 pointer-events-none transition-colors duration-1000 ${isEmergency
                ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cortex-danger/10 via-transparent to-transparent'
                : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cortex-accent/10 via-transparent to-transparent'
              }`}></div>
            <PlantSVGMap assets={assets} isEmergency={isEmergency} focusedAssetId={focusedAssetId} onAssetClick={setFocusedAssetId} />
          </div>
        </Card>
      </motion.div>
      <motion.div className={`flex flex-col space-y-4 ${isEmergency ? 'hidden' : 'flex'}`} layout>
        <div className="flex items-center justify-between ml-1">
           <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-cortex-text-muted">{t('telemetry')}</h3>
           {focusedAssetId && (
             <button onClick={() => setFocusedAssetId(null)} className="text-[9px] uppercase tracking-widest text-cortex-accent font-bold hover:text-white transition-colors">{t('resetFocus')}</button>
           )}
        </div>
        <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
          {assets.map(asset => (
            <AssetTelemetryCard 
              key={asset.id} 
              asset={asset} 
              isFocused={focusedAssetId === asset.id} 
              onClick={() => setFocusedAssetId(asset.id)} 
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const PlantSVGMap = ({ assets, isEmergency, focusedAssetId, onAssetClick }: { assets: Asset[], isEmergency: boolean, focusedAssetId: string | null, onAssetClick: (id: string) => void }) => {
  const { t } = useUiStore();
  return (
    <svg className={`w-full h-full max-h-[500px] transition-all duration-700 ${isEmergency ? 'drop-shadow-[0_0_20px_rgba(255,23,68,0.2)] scale-105' : 'drop-shadow-[0_0_15px_rgba(0,229,255,0.15)] scale-100'}`} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="pipe-active" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0, 229, 255, 0.1)" />
          <stop offset="50%" stopColor="rgba(0, 229, 255, 0.9)" />
          <stop offset="100%" stopColor="rgba(0, 229, 255, 0.1)" />
        </linearGradient>
        <linearGradient id="pipe-critical" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255, 23, 68, 0.1)" />
          <stop offset="50%" stopColor="rgba(255, 23, 68, 1)" />
          <stop offset="100%" stopColor="rgba(255, 23, 68, 0.1)" />
        </linearGradient>
      </defs>

      {/* Connection Lines (Pipelines) */}
      <path d="M 25 35 Q 25 65 50 65" fill="none" stroke={isEmergency ? "rgba(255,255,255,0.05)" : "url(#pipe-active)"} strokeWidth="0.8" className={isEmergency ? "" : "animate-pulse"} filter="url(#glow)" />

      {/* Critical Fault Propagation Line */}
      {isEmergency ? (
        <path d="M 50 65 Q 60 50 75 35" fill="none" stroke="url(#pipe-critical)" strokeWidth="1.5" strokeDasharray="2,2" className="animate-[pulse_0.5s_linear_infinite]" filter="url(#glow)" />
      ) : (
        <path d="M 75 35 Q 75 65 50 65" fill="none" stroke="url(#pipe-active)" strokeWidth="0.8" className="animate-pulse" filter="url(#glow)" />
      )}

      <path d="M 50 65 L 50 85" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" strokeDasharray="1,1.5" className="animate-[pulse_2s_linear_infinite]" />
      <path d="M 25 35 Q 50 15 75 35" fill="none" stroke={isEmergency ? "rgba(255,255,255,0.05)" : "rgba(0, 229, 255, 0.4)"} strokeWidth="0.5" strokeDasharray="2,2" />

      {/* Nodes */}
      {assets.map((asset) => {
        const colors = {
          optimal: '#00e676',
          warning: '#ffb300',
          critical: '#ff1744'
        };
        const color = colors[asset.status];
        const isAlert = asset.status !== 'optimal';
        const isFaded = (isEmergency && !isAlert) || (focusedAssetId && focusedAssetId !== asset.id);
        const isFocused = focusedAssetId === asset.id;

        return (
          <g 
            key={asset.id} 
            transform={`translate(${asset.x}, ${asset.y})`} 
            className={`transition-all duration-500 ease-in-out cursor-pointer ${isFaded ? 'opacity-20 grayscale' : 'opacity-100'} ${isFocused ? 'scale-125' : 'scale-100'}`}
            onClick={() => onAssetClick(asset.id)}
          >
            {/* Status Glow Ring */}
            <circle cx="0" cy="0" r={isFocused ? "12" : "8"} fill={color} opacity="0.1" className={isAlert || isFocused ? 'animate-ping' : ''} />
            
            {/* Industrial Illustration */}
            <foreignObject x="-12" y="-12" width="24" height="24">
              <div className="w-full h-full flex items-center justify-center">
                {asset.id === 'boiler' && <BoilerIllustration status={asset.status} value={asset.metrics.temp} />}
                {asset.id === 'pump' && <PumpIllustration status={asset.status} rpm={asset.metrics.rpm} />}
                {asset.id === 'vessel' && <VesselIllustration status={asset.status} value={asset.metrics.pressure} />}
                {asset.id === 'conveyor' && <ConveyorIllustration status={asset.status} />}
              </div>
            </foreignObject>

            <circle cx="0" cy="0" r="1.5" fill={color} filter="url(#glow)" className="transition-all duration-500" />

            <rect x="-14" y="14" width="28" height="7" rx="1.5" fill="rgba(19,27,42,0.85)" stroke={isFocused ? "var(--color-cortex-accent)" : isAlert && isEmergency ? "rgba(255,23,68,0.5)" : "rgba(255,255,255,0.15)"} strokeWidth={isFocused ? "0.8" : "0.3"} className="transition-all duration-500" />
            <text x="0" y="18.5" fontSize="2.8" fill={isFocused ? "var(--color-cortex-accent)" : "#e2e8f0"} textAnchor="middle" fontWeight="bold" letterSpacing="0.05" className="transition-colors">{t(asset.id as any)}</text>

            {asset.metrics.temp && asset.id !== 'conveyor' && (
              <text x="0" y="-15" fontSize={isEmergency && isAlert ? "2.8" : "2.2"} fill={color} textAnchor="middle" fontWeight="bold" filter="url(#glow)" className="transition-all duration-500">
                {asset.metrics.temp.toFixed(0)}°C
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

const AssetTelemetryCard = ({ asset, isFocused, onClick }: { asset: Asset, isFocused: boolean, onClick: () => void }) => {
  const { t } = useUiStore();
  const isWarning = asset.status === 'warning';
  const isCritical = asset.status === 'critical';

  const borderClass = isFocused ? 'border-cortex-accent ring-1 ring-cortex-accent/30' : isCritical ? 'border-cortex-danger' : isWarning ? 'border-cortex-warning' : 'border-white/5';
  const shadowClass = isFocused ? 'shadow-[0_0_20px_rgba(0,229,255,0.2)]' : isCritical ? 'shadow-[0_0_15px_rgba(255,23,68,0.2)]' : isWarning ? 'shadow-[0_0_15px_rgba(255,179,0,0.1)]' : '';
  const bgClass = isFocused ? 'bg-cortex-accent/5' : isCritical ? 'bg-cortex-danger/10' : isWarning ? 'bg-cortex-warning/10' : 'bg-black/20';
  const statusColor = isCritical ? 'text-cortex-danger' : isWarning ? 'text-cortex-warning' : 'text-cortex-success';
  const glowDotColor = isCritical ? 'bg-cortex-danger shadow-[0_0_8px_var(--color-cortex-danger)] animate-pulse' : isWarning ? 'bg-cortex-warning shadow-[0_0_8px_var(--color-cortex-warning)] animate-pulse' : 'bg-cortex-success shadow-[0_0_8px_var(--color-cortex-success)]';

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02, x: 4 }}
      onClick={onClick}
      className={`glass-panel-interactive p-4 rounded-xl border-l-2 relative overflow-hidden transition-all duration-500 cursor-pointer ${borderClass} ${shadowClass} ${isFocused ? 'translate-x-2' : ''}`}
    >
      <div className={`absolute inset-0 opacity-50 pointer-events-none ${bgClass} transition-colors duration-500`}></div>

      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/10 p-1">
             {asset.id === 'boiler' && <BoilerIllustration status={asset.status} value={asset.metrics.temp} />}
             {asset.id === 'pump' && <PumpIllustration status={asset.status} rpm={asset.metrics.rpm} />}
             {asset.id === 'vessel' && <VesselIllustration status={asset.status} value={asset.metrics.pressure} />}
             {asset.id === 'conveyor' && <ConveyorIllustration status={asset.status} />}
          </div>
          <div>
            <h4 className={`text-sm font-bold tracking-wide transition-colors ${isFocused ? 'text-cortex-accent' : 'text-white'}`}>{t(asset.id as any)}</h4>
            <span className={`text-[10px] uppercase font-mono tracking-widest font-bold ${statusColor} transition-colors duration-500`}>
              {t('status')}: {asset.status}
            </span>
          </div>
        </div>
        <div className={`w-2 h-2 rounded-full mt-1 ${glowDotColor}`}></div>
      </div>

      <div className="grid grid-cols-2 gap-2 relative z-10">
        {asset.metrics.temp !== undefined && <MetricItem icon={<Thermometer size={12} />} label="TEMP" value={asset.metrics.temp.toFixed(1)} unit="°C" isAlert={isCritical} />}
        {asset.metrics.pressure !== undefined && <MetricItem icon={<Gauge size={12} />} label="PRES" value={asset.metrics.pressure.toFixed(1)} unit=" PSI" isAlert={asset.id === 'vessel' && isCritical} />}
        {asset.metrics.rpm !== undefined && <MetricItem icon={<Settings size={12} />} label="RPM" value={asset.metrics.rpm.toFixed(0)} unit="" />}
        {asset.metrics.vibration !== undefined && <MetricItem icon={<Activity size={12} />} label="VIB" value={asset.metrics.vibration.toFixed(2)} unit=" mm/s" isAlert={isWarning || isCritical} />}
      </div>
    </motion.div>
  );
};

const MetricItem = ({ icon, label, value, unit, isAlert = false }: { icon: React.ReactNode, label: string, value: string | number, unit: string, isAlert?: boolean }) => (
  <div className={`rounded-lg border p-2 flex flex-col transition-colors duration-500 ${isAlert ? 'bg-red-950/30 border-red-500/30' : 'bg-black/30 border-white/5'}`}>
    <div className={`flex items-center gap-1.5 mb-1 ${isAlert ? 'text-red-400' : 'text-cortex-text-muted'}`}>
      {icon}
      <span className="text-[9px] uppercase tracking-widest font-bold">{label}</span>
    </div>
    <div className="flex items-baseline gap-0.5">
      <span className={`text-sm font-mono font-medium ${isAlert ? 'text-red-400' : 'text-white'}`}>{value}</span>
      <span className={`text-[9px] ${isAlert ? 'text-red-500' : 'text-cortex-text-muted'}`}>{unit}</span>
    </div>
  </div>
);
