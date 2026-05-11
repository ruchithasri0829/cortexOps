import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, Activity, TrendingUp, Filter } from 'lucide-react';
import { Card } from '../ui/Card';
import { useUiStore } from '../../store/uiStore';

export const AnalyticsTab: React.FC = () => {
  const { isEmergency, t } = useUiStore();
  const [dataPoints, setDataPoints] = useState<number[]>(Array(20).fill(60));
  const [activeFilter, setActiveFilter] = useState<'throughput' | 'consumption' | 'vibration'>('throughput');

  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints(prev => {
        let base = 40;
        let variance = 40;
        
        if (activeFilter === 'consumption') { base = 30; variance = 20; }
        if (activeFilter === 'vibration') { base = 10; variance = 10; }
        if (isEmergency) { base += 30; }

        const next = [...prev.slice(1), Math.random() * variance + base];
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isEmergency, activeFilter]);

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 shrink-0">
         {[
           { label: t('avgEfficiency' as any), val: '94.2', unit: '%', icon: TrendingUp, color: 'text-cortex-success' },
           { label: t('energyCost' as any), val: '4.82', unit: 'k$', icon: Activity, color: 'text-cortex-accent' },
           { label: t('thermalWaste' as any), val: '12.4', unit: 'MW', icon: Activity, color: 'text-cortex-warning' },
           { label: t('mtbf' as any), val: '342', unit: 'Hrs', icon: Clock, color: 'text-cortex-accent' }
         ].map((stat, i) => (
           <Card key={i} className="flex flex-row items-center gap-4 p-5 border-white/5">
             <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
               <stat.icon size={20} />
             </div>
             <div>
                <p className="text-[10px] text-cortex-text-muted uppercase tracking-widest font-bold">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-light text-white">{stat.val}</span>
                  <span className="text-xs text-cortex-text-muted">{stat.unit}</span>
                </div>
             </div>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <Card title={t('activeAlarms' as any)} className="lg:col-span-2 border-white/5 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
               {(['throughput', 'consumption', 'vibration'] as const).map(f => (
                 <button 
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`text-[10px] font-bold transition-all pb-1 tracking-widest uppercase ${activeFilter === f ? 'text-cortex-accent border-b border-cortex-accent' : 'text-cortex-text-muted hover:text-white'}`}
                 >
                   {f}
                 </button>
               ))}
            </div>
            <div className="flex gap-2">
               <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-full border border-white/10 text-[9px] text-cortex-text-muted font-bold tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-cortex-accent"></div> LIVE
               </div>
            </div>
          </div>
          
          <div className="flex-1 min-h-[300px] flex items-end gap-1 px-4 pb-4">
            {dataPoints.map((p, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${p}%` }}
                className={`flex-1 rounded-t-sm transition-colors duration-500 ${isEmergency && p > 70 ? 'bg-cortex-danger/50 shadow-[0_0_15px_rgba(255,23,68,0.3)]' : 'bg-cortex-accent/30'}`}
              />
            ))}
          </div>
          
          <div className="flex justify-between px-2 pt-4 border-t border-white/5 text-[10px] font-mono text-cortex-text-muted">
             <span>T-40 MIN</span>
             <span>T-20 MIN</span>
             <span>CURRENT</span>
          </div>
        </Card>

        <Card title={t('incidentTimeline')} className="border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
             <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                <Filter size={14} className="text-cortex-text-muted" />
             </div>
             <button className="text-[10px] font-bold text-cortex-accent tracking-widest uppercase flex items-center gap-1">
                {t('exportLog')} <ChevronRight size={12} />
             </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
             {[
               { time: '10:04:22', event: 'Primary Seal Fracture', source: 'Pump A2', type: 'critical' },
               { time: '10:03:15', event: 'Thermal Spike Detected', source: 'Boiler 1', type: 'warning' },
               { time: '10:01:05', event: 'Load Balance Adjusted', source: 'System', type: 'info' },
               { time: '09:55:42', event: 'Shift Start Sequence', source: 'Operator: J. Doe', type: 'info' },
               { time: '09:50:00', event: 'Automatic Health Check', source: 'System', type: 'info' },
               { time: '09:42:12', event: 'Maintenance Lock Released', source: 'Valve V-102', type: 'info' },
             ].map((log, idx) => (
               <div key={idx} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${
                      log.type === 'critical' ? 'bg-cortex-danger shadow-[0_0_8px_var(--color-cortex-danger)]' :
                      log.type === 'warning' ? 'bg-cortex-warning shadow-[0_0_8px_var(--color-cortex-warning)]' :
                      'bg-white/20'
                    }`}></div>
                    <div className="flex-1 w-px bg-white/5 my-1"></div>
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex justify-between items-start mb-0.5">
                       <span className="text-xs font-medium text-white group-hover:text-cortex-accent transition-colors">{log.event}</span>
                       <span className="text-[10px] font-mono text-cortex-text-muted">{log.time}</span>
                    </div>
                    <p className="text-[10px] text-cortex-text-muted uppercase tracking-widest font-bold">Source: {log.source}</p>
                  </div>
               </div>
             ))}
          </div>
          <button className="w-full mt-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
             {t('enterSimulation')}
          </button>
        </Card>
      </div>
    </div>
  );
};
