import React from 'react';
import { useUiStore } from '../store/uiStore';
import { X, Activity, Server, Zap, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RightPanel: React.FC = () => {
  const { isRightPanelOpen, toggleRightPanel, isEmergency, toggleEmergency, t } = useUiStore();

  return (
    <AnimatePresence initial={false}>
      {isRightPanelOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleRightPanel}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed lg:static right-0 top-0 bottom-0 w-80 lg:w-96 glass-panel border-y-0 border-r-0 border-l border-white/5 shadow-2xl z-50 flex flex-col shrink-0"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.01]">
              <h2 className="text-xs font-bold tracking-[0.2em] text-white uppercase flex items-center gap-2">
                <Activity size={16} className="text-cortex-accent" />
                {t('systemHealth')}
              </h2>
              <button 
                onClick={toggleRightPanel}
                className="p-2 rounded-xl text-cortex-text-muted hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
              {/* Control Center */}
              <div>
                <h3 className="text-[10px] font-bold text-cortex-text-muted uppercase tracking-[0.2em] mb-4">{t('settings')}</h3>
                <div className="grid grid-cols-1 gap-3">
                  {!isEmergency ? (
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={toggleEmergency}
                      className="w-full p-4 rounded-xl border border-cortex-danger/30 bg-cortex-danger/10 text-cortex-danger font-bold text-xs uppercase tracking-widest hover:bg-cortex-danger hover:text-white transition-all shadow-[0_0_15px_rgba(255,23,68,0.1)] flex items-center justify-center gap-2 group"
                    >
                      <AlertTriangle size={16} className="group-hover:animate-pulse" />
                      {t('simulateIncident')}
                    </motion.button>
                  ) : (
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={toggleEmergency}
                      className="w-full p-4 rounded-xl border border-cortex-success/30 bg-cortex-success/10 text-cortex-success font-bold text-xs uppercase tracking-widest hover:bg-cortex-success hover:text-black transition-all shadow-[0_0_15px_rgba(0,230,118,0.1)] flex items-center justify-center gap-2 group"
                    >
                      <CheckCircle2 size={16} />
                      {t('resolveIncident')}
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Status Block */}
              <div>
                <h3 className="text-[10px] font-bold text-cortex-text-muted uppercase tracking-[0.2em] mb-4">Live Performance</h3>
                <div className="space-y-3">
                  <MetricCard icon={<Activity size={18}/>} label="CPU Usage" value="42%" color="text-cortex-accent" bg="bg-cortex-accent/10" border="border-cortex-accent/20" />
                  <MetricCard icon={<Server size={18}/>} label="Memory" value="16.4 GB" color="text-cortex-success" bg="bg-cortex-success/10" border="border-cortex-success/20" />
                  <MetricCard icon={<Zap size={18}/>} label="Power Draw" value="1.2 MW" color="text-cortex-warning" bg="bg-cortex-warning/10" border="border-cortex-warning/20" />
                </div>
              </div>

              {/* Event Log */}
              <div>
                <h3 className="text-[10px] font-bold text-cortex-text-muted uppercase tracking-[0.2em] mb-4">Telemetry Stream</h3>
                <div className="space-y-4">
                  <EventItem time="10:42:05 AM" msg="Pump Alpha initialized" type="info" />
                  <EventItem time="10:38:12 AM" msg="Pressure transient detected" type="warn" />
                  <EventItem time="10:15:00 AM" msg="System sync complete" type="success" />
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};


const MetricCard = ({ icon, label, value, color, bg, border }: { icon: React.ReactNode, label: string, value: string, color: string, bg: string, border: string }) => (
  <div className="bg-black/20 border border-white/5 p-3.5 rounded-xl flex items-center justify-between group hover:border-white/10 transition-colors">
    <div className="flex items-center space-x-3">
      <div className={`p-2.5 rounded-lg ${bg} ${border} border ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-cortex-text-muted tracking-wide">{label}</span>
    </div>
    <span className={`text-lg font-light tracking-tight ${color}`}>{value}</span>
  </div>
);

const EventItem = ({ time, msg, type }: { time: string, msg: string, type: 'info' | 'warn' | 'success' }) => {
  const types = {
    info: { color: 'text-cortex-accent', border: 'border-cortex-accent/30', bg: 'bg-cortex-accent/5', icon: Info },
    warn: { color: 'text-cortex-warning', border: 'border-cortex-warning/30', bg: 'bg-cortex-warning/5', icon: AlertTriangle },
    success: { color: 'text-cortex-success', border: 'border-cortex-success/30', bg: 'bg-cortex-success/5', icon: CheckCircle2 },
  };
  
  const T = types[type];
  const Icon = T.icon;

  return (
    <div className="flex items-start space-x-3 relative">
      <div className={`mt-1 z-10 bg-black rounded-full p-0.5 ${T.color}`}>
        <Icon size={16} />
      </div>
      <div className={`flex-1 p-3.5 rounded-xl border ${T.border} ${T.bg} backdrop-blur-sm`}>
        <p className="text-sm text-white mb-1.5 tracking-wide font-medium">{msg}</p>
        <span className="text-[10px] uppercase tracking-widest font-mono text-cortex-text-muted">{time}</span>
      </div>
    </div>
  );
};
