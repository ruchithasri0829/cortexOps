import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Activity, Zap, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { useUiStore } from '../../store/uiStore';
import { BoilerIllustration } from './AssetIllustrations';

export const DigitalTwinTab: React.FC = () => {
  const { isEmergency, t } = useUiStore();
  const [isIsolating, setIsIsolating] = React.useState(false);

  const handleIsolate = () => {
    setIsIsolating(true);
    setTimeout(() => setIsIsolating(false), 3000);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
        <Card title={t('assetHealth')} className="col-span-1 border-white/5" glow>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                <circle
                  cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                  strokeDasharray="251.2" strokeDashoffset={isEmergency ? "150" : "50"}
                  className={`transition-all duration-1000 ${isEmergency ? 'text-cortex-danger' : 'text-cortex-success'}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className={`text-2xl font-light tracking-tighter ${isEmergency ? 'text-cortex-danger neon-text' : 'text-cortex-success'}`}>
                  {isEmergency ? '40' : '80'}
                </span>
                <span className="text-[8px] font-bold text-cortex-text-muted uppercase tracking-widest mt-0.5">SCORE</span>
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium text-sm tracking-wide mb-1">{t('overallPlantHealth')}</h4>
              <p className="text-xs text-cortex-text-muted leading-relaxed">Aggregated from 142 sensors. Evaluates thermal efficiency, vibration harmonics, and mechanical wear.</p>
            </div>
          </div>
          <div className="space-y-3">
            <HealthBar label="Cooling Systems" value={isEmergency ? 20 : 92} status={isEmergency ? 'critical' : 'good'} />
            <HealthBar label="Main Boilers" value={85} status="good" />
            <HealthBar label="Power Grid" value={78} status="warning" />
          </div>
        </Card>

        <Card title={t('predictiveMaintenance')} className="col-span-1 lg:col-span-2 border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {[
              { asset: 'Pump A2 (Cooling)', urgency: isEmergency ? 'Immediate' : 'High', days: isEmergency ? 0 : 2, icon: RefreshCw, status: isEmergency ? 'danger' : 'warning', issue: 'Seal Degredation' },
              { asset: 'Valve V-409', urgency: 'Medium', days: 14, icon: Zap, status: 'warning', issue: 'Actuator Delay' },
              { asset: 'Compressor C-1', urgency: 'Low', days: 45, icon: Activity, status: 'good', issue: 'Filter Replacement' },
              { asset: 'Generator G-2', urgency: 'Low', days: 90, icon: Cpu, status: 'good', issue: 'Routine Inspection' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-xl border flex gap-4 ${item.status === 'danger' ? 'bg-cortex-danger/10 border-cortex-danger/30' :
                    item.status === 'warning' ? 'bg-cortex-warning/10 border-cortex-warning/30' :
                      'bg-white/5 border-white/10'
                  }`}
              >
                <div className={`p-2.5 rounded-lg h-fit shrink-0 ${item.status === 'danger' ? 'bg-cortex-danger/20 text-cortex-danger' :
                    item.status === 'warning' ? 'bg-cortex-warning/20 text-cortex-warning' :
                      'bg-white/10 text-white/50'
                  }`}>
                  <item.icon size={20} className={item.status === 'danger' ? 'animate-pulse' : ''} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-0.5">{item.asset}</h4>
                  <p className="text-[10px] text-cortex-text-muted font-mono tracking-widest uppercase mb-2">{item.issue}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded ${item.status === 'danger' ? 'bg-cortex-danger text-black' :
                        item.status === 'warning' ? 'bg-cortex-warning text-black' :
                          'bg-white/20 text-white'
                      }`}>
                      {item.urgency}
                    </span>
                    <span className="text-xs text-cortex-text-muted font-mono">
                      {item.days === 0 ? 'NOW' : `in ${item.days} days`}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="3D Digital Twin Simulation" className="flex-1 min-h-[400px] border-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center pointer-events-none group-hover:bg-black/40 transition-colors">
          <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center opacity-60">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: 'linear' }} className="absolute inset-0 border border-cortex-accent/20 rounded-full border-dashed"></motion.div>
            <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 30, ease: 'linear' }} className="absolute inset-10 border border-cortex-accent/10 rounded-full border-dashed"></motion.div>

            <div className="absolute inset-10 border border-white/5 rounded-full flex items-center justify-center bg-cortex-accent/5 backdrop-blur-sm p-20">
              <BoilerIllustration status={isEmergency ? 'critical' : 'optimal'} value={isEmergency ? 580 : 450} />
            </div>

            {/* Scanning lines */}
            <motion.div
              animate={{ y: [-150, 150] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear', repeatType: 'reverse' }}
              className={`absolute w-full h-[2px] z-20 ${isIsolating ? 'bg-white shadow-[0_0_30px_#fff]' : 'bg-cortex-accent/50 shadow-[0_0_20px_var(--color-cortex-accent)]'}`}
            ></motion.div>
          </div>

          <div className="mt-8 flex gap-4 pointer-events-auto">
            <button
              onClick={handleIsolate}
              disabled={isIsolating}
              className={`px-4 py-2 border rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${isIsolating ? 'bg-white/10 border-white/20 text-white cursor-wait' : 'bg-cortex-accent/10 border-cortex-accent/30 text-cortex-accent hover:bg-cortex-accent hover:text-black'}`}
            >
              {isIsolating ? t('initializingIsolation') : t('isolateSubsystem')}
            </button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
              {t('viewSchematics')}
            </button>
          </div>
        </div>
        <div className="absolute top-6 right-6 z-20 flex gap-2">
          <div className={`px-3 py-1 rounded bg-black/50 border backdrop-blur-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${isEmergency ? 'border-cortex-danger/50 text-cortex-danger' : 'border-cortex-success/50 text-cortex-success'}`}>
            {isEmergency ? <AlertTriangle size={12} /> : <ShieldCheck size={12} />}
            {isEmergency ? 'Structural Anomaly Detected' : 'Twin Sync: Nominal'}
          </div>
        </div>
      </Card>
    </div>
  );
};

const HealthBar = ({ label, value, status }: { label: string, value: number, status: 'good' | 'warning' | 'critical' }) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between text-xs">
      <span className="text-white/80">{label}</span>
      <span className="font-mono text-cortex-text-muted">{value}%</span>
    </div>
    <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className={`h-full rounded-full ${status === 'critical' ? 'bg-cortex-danger shadow-[0_0_10px_var(--color-cortex-danger)]' :
            status === 'warning' ? 'bg-cortex-warning shadow-[0_0_10px_var(--color-cortex-warning)]' :
              'bg-cortex-success shadow-[0_0_10px_var(--color-cortex-success)]'
          }`}
      />
    </div>
  </div>
);
