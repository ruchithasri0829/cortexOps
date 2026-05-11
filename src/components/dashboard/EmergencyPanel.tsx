import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, BrainCircuit } from 'lucide-react';
import { Card } from '../ui/Card';
import { useUiStore } from '../../store/uiStore';

export const EmergencyPanel: React.FC = () => {
  const { t } = useUiStore();
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);

  const handleToggleStep = (step: number) => {
    setCompletedSteps(prev => 
      prev.includes(step) ? prev.filter(s => s !== step) : [...prev, step]
    );
  };

  const steps = [
    { step: 1, action: t('guidedAction1' as any) || "Isolate Cooling Pump 02", desc: t('guidedAction1Desc' as any) || "Close isolation valves V-102 and V-103" },
    { step: 2, action: t('guidedAction2' as any) || "Activate Backup Pump", desc: t('guidedAction2Desc' as any) || "Engage auxiliary cooling circuit B" },
    { step: 3, action: t('guidedAction3' as any) || "Vent Pressure Vessel", desc: t('guidedAction3Desc' as any) || "Open relief valve RV-45 to 30%" },
    { step: 4, action: t('guidedAction4' as any) || "Deploy Maintenance", desc: t('guidedAction4Desc' as any) || "Dispatch Level 3 repair team to Sector 4" },
  ];

  return (
    <div className="flex flex-col space-y-6 h-full">
      <Card title={t('rootCause')} className="border-cortex-danger/50 shadow-[0_0_30px_rgba(255,23,68,0.15)]" glow>
        <div className="flex gap-4">
          <div className="p-3 bg-black/40 rounded-xl h-fit border border-cortex-danger/30 shrink-0">
            <BrainCircuit className="text-cortex-danger animate-pulse" size={24} />
          </div>
          <div>
            <h4 className="text-white font-medium text-lg mb-1 tracking-wide">{t('emergencyMode')}</h4>
            <p className="text-sm text-cortex-text-muted mb-4 leading-relaxed">
              {t('incidentDetected')}
            </p>
            <div className="flex gap-3">
              <span className="px-2.5 py-1.5 rounded bg-black/50 border border-white/5 text-[10px] font-mono tracking-widest font-bold text-cortex-accent">
                CONFIDENCE: 98.4%
              </span>
              <span className="px-2.5 py-1.5 rounded bg-cortex-danger/20 border border-cortex-danger/30 text-[10px] font-mono tracking-widest font-bold text-cortex-danger animate-pulse">
                IMPACT: CRITICAL
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card title={t('guidedActions')} className="flex-1">
        <div className="space-y-3">
          {steps.map((item, idx) => {
            const isDone = completedSteps.includes(item.step);
            return (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (idx * 0.1), type: 'spring', stiffness: 300 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleToggleStep(item.step)}
                className={`flex items-center gap-4 p-4 rounded-xl border group cursor-pointer transition-all relative overflow-hidden ${
                  isDone ? 'bg-cortex-success/10 border-cortex-success/30' : 'bg-black/20 border-white/5 hover:bg-white/[0.02] hover:border-cortex-accent/30'
                }`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${isDone ? 'bg-cortex-success' : 'group-hover:bg-cortex-accent'}`}></div>
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors shadow-inner ${
                  isDone ? 'bg-cortex-success border-cortex-success text-black' : 'bg-black/40 border-white/10 group-hover:border-cortex-accent'
                }`}>
                  {isDone ? <CheckCircle size={14} /> : <span className="text-xs text-cortex-text-muted font-bold font-mono group-hover:text-cortex-accent">{item.step}</span>}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium tracking-wide transition-colors ${isDone ? 'text-cortex-success' : 'text-white group-hover:text-cortex-accent'}`}>{item.action}</div>
                  <div className="text-[10px] text-cortex-text-muted font-mono tracking-widest mt-0.5">{item.desc}</div>
                </div>
                {!isDone && <ArrowRight size={18} className="text-cortex-text-muted group-hover:text-cortex-accent transition-colors" />}
                {isDone && <CheckCircle size={18} className="text-cortex-success" />}
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

