import { useUiStore } from '../store/uiStore';
import type { Alarm } from '../store/uiStore';
import { AlertOctagon, AlertTriangle, Info, ShieldAlert, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AlarmPanel() {
  const { alarms, isEmergency, clearAlarms, removeAlarm, t } = useUiStore();

  const criticalAlarms = alarms.filter(a => a.tier === 'critical');
  const watchAlarms = alarms.filter(a => a.tier === 'watch');
  const infoAlarms = alarms.filter(a => a.tier === 'info');

  return (
    <div className="flex-1 flex flex-col h-full bg-cortex-bg/50 backdrop-blur-xl animate-fade-in overflow-hidden">
      <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cortex-danger/10 rounded-lg">
            <ShieldAlert className="w-5 h-5 text-cortex-danger" />
          </div>
          <div>
            <h2 className="font-bold uppercase tracking-[0.2em] text-xs text-white">{t('activeAlarms')}</h2>
            <div className="text-[10px] text-cortex-text-muted font-mono mt-1">TOTAL: {alarms.length}</div>
          </div>
        </div>
        <button 
          onClick={clearAlarms}
          className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-cortex-text-muted hover:text-white hover:bg-white/5 rounded-md transition-all"
        >
          {t('clearAll')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {isEmergency && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cortex-danger/10 border border-cortex-danger/30 rounded-xl p-5 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-cortex-danger shadow-[0_0_15px_var(--color-cortex-danger)]"></div>
            <h3 className="text-cortex-danger font-bold text-[10px] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <Bell size={12} className="animate-pulse" />
              {t('rootCause')}
            </h3>
            <p className="text-sm text-white/80 leading-relaxed font-medium">
              Cooling System Failure Imminent - 92% confidence. Pump cavitation causing bearing overheating and subsequent boiler pressure rise.
            </p>
          </motion.div>
        )}

        <div className="space-y-3">
          <AnimatePresence initial={false} mode="popLayout">
            {criticalAlarms.map(alarm => (
              <AlarmCard 
                key={alarm.id} 
                alarm={alarm} 
                onRemove={() => removeAlarm(alarm.id)}
                icon={<AlertOctagon className="w-5 h-5 text-cortex-danger" />} 
                colorClass="border-cortex-danger/30 bg-cortex-danger/5" 
                glowColor="var(--color-cortex-danger)"
              />
            ))}
            {watchAlarms.map(alarm => (
              <AlarmCard 
                key={alarm.id} 
                alarm={alarm} 
                onRemove={() => removeAlarm(alarm.id)}
                icon={<AlertTriangle className="w-5 h-5 text-cortex-warning" />} 
                colorClass="border-cortex-warning/30 bg-cortex-warning/5"
                glowColor="var(--color-cortex-warning)"
              />
            ))}
            {infoAlarms.map(alarm => (
              <AlarmCard 
                key={alarm.id} 
                alarm={alarm} 
                onRemove={() => removeAlarm(alarm.id)}
                icon={<Info className="w-5 h-5 text-cortex-accent" />} 
                colorClass="border-white/5 bg-white/[0.02]"
                glowColor="var(--color-cortex-accent)"
              />
            ))}
          </AnimatePresence>
          
          {alarms.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-cortex-text-muted">
               <div className="p-4 rounded-full bg-white/5 mb-4 opacity-20">
                  <Bell size={48} strokeWidth={1} />
               </div>
               <p className="text-xs uppercase tracking-[0.2em] font-bold">{t('noAlarms')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface AlarmCardProps {
  alarm: Alarm;
  icon: React.ReactNode;
  colorClass: string;
  glowColor: string;
  onRemove: () => void;
}

function AlarmCard({ alarm, icon, colorClass, glowColor, onRemove }: AlarmCardProps) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ x: 4 }}
      className={`p-4 rounded-xl border-l-2 ${colorClass} transition-all duration-300 relative group cursor-pointer`}
      style={{ borderLeftColor: glowColor }}
    >
      <div className="flex items-start gap-4">
        <div className="mt-0.5 group-hover:scale-110 transition-transform">{icon}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <p className="text-sm font-medium text-white tracking-wide">{alarm.message}</p>
            <span className="text-[9px] font-mono text-cortex-text-muted mt-0.5">{new Date(alarm.timestamp).toLocaleTimeString()}</span>
          </div>
          <p className="text-[10px] text-cortex-text-muted uppercase tracking-widest font-bold">ASSET: {alarm.assetId}</p>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/5 rounded"
        >
           <X size={14} className="text-cortex-text-muted" />
        </button>
      </div>
    </motion.div>
  );
}

