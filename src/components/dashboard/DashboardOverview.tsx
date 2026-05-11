import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, ShieldAlert, Clock, ArrowUpRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { PlantOverview } from './PlantOverview';
import { EmergencyPanel } from './EmergencyPanel';
import { useUiStore } from '../../store/uiStore';
import type { TranslationKey } from '../../store/uiStore';

export const DashboardOverview: React.FC = () => {
  const { isEmergency, t } = useUiStore();

  return (
    <div className="flex flex-col space-y-8 h-full">
      <AnimatePresence mode="popLayout">
        {!isEmergency && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, height: 0, marginBottom: 0, overflow: 'hidden' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 shrink-0"
          >
            {[
              { id: 'totalOutput', val: '124.5', unit: 'kU', color: 'text-cortex-accent', icon: Activity, trend: '+2.4%' },
              { id: 'systemLoad', val: '78.2', unit: '%', color: 'text-cortex-warning', icon: Zap, trend: '+0.8%' },
              { id: 'alerts', val: '3', unit: '', color: 'text-cortex-danger', icon: ShieldAlert, trend: '-1' },
              { id: 'uptime', val: '99.9', unit: '%', color: 'text-cortex-success', icon: Clock, trend: 'Optimal' },
            ].map((stat, i) => (
              <Card key={i} interactive glow className="group">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-2xl bg-white/[0.03] group-hover:bg-cortex-accent/10 border border-white/5 transition-all duration-500 ${stat.color}`}>
                    <stat.icon size={22} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div className={`flex items-center gap-1.5 text-[10px] tracking-[0.1em] font-bold uppercase px-2.5 py-1 rounded-full border ${
                    stat.id === 'alerts' ? 'text-cortex-danger border-cortex-danger/20 bg-cortex-danger/5' : 'text-cortex-success border-cortex-success/20 bg-cortex-success/5'
                  }`}>
                    {stat.trend.includes('+') || stat.trend === 'Optimal' ? <ArrowUpRight size={12} /> : null}
                    {stat.trend}
                  </div>
                </div>
                <div className="flex flex-col mt-auto">
                  <div className="text-[10px] text-cortex-text-muted uppercase tracking-[0.25em] font-bold mb-2 opacity-60">{t(stat.id as TranslationKey)}</div>
                  <div className="flex items-baseline space-x-1.5">
                    <span className={`text-4xl md:text-5xl font-light tracking-tighter group-hover:neon-text transition-all duration-500 ${stat.color}`}>{stat.val}</span>
                    <span className="text-sm text-cortex-text-muted font-bold opacity-40 uppercase tracking-widest">{stat.unit}</span>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout className="flex flex-col xl:flex-row gap-8 flex-1 min-h-[500px]">
        <motion.div layout className={`flex flex-col transition-all duration-1000 ease-in-out ${isEmergency ? 'xl:w-[42%]' : 'xl:w-full'}`}>
          <PlantOverview />
        </motion.div>

        <AnimatePresence>
          {isEmergency && (
            <motion.div 
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="w-full h-full min-w-[500px]">
                <EmergencyPanel />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
