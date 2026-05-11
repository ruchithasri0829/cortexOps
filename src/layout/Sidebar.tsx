import React from 'react';
import { LayoutDashboard, LineChart, ShieldAlert, Cpu, Box, ClipboardList } from 'lucide-react';
import { useUiStore } from '../store/uiStore';
import type { Tab, TranslationKey } from '../store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard },
  { id: 'processes', icon: Cpu },
  { id: 'analytics', icon: LineChart },
  { id: 'alerts', icon: ShieldAlert },
  { id: 'builder', icon: Box },
  { id: 'settings', icon: ClipboardList },
] as const;

export const Sidebar: React.FC = () => {
  const { isSidebarOpen, activeTab, setActiveTab, t } = useUiStore();

  return (
    <AnimatePresence initial={false}>
      {isSidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="h-full glass-panel border-y-0 border-l-0 border-r border-white/5 flex flex-col z-30 shrink-0 overflow-hidden relative"
        >
          <div className="p-8 pt-10 flex-1">
            <div className="text-[10px] font-bold text-cortex-text-muted uppercase tracking-[0.3em] mb-8 px-4 opacity-70">
              {t('plantOverview')}
            </div>
            <nav className="space-y-2 w-full">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as Tab)}
                    className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      isActive 
                        ? 'text-white bg-white/[0.03] border border-white/10 shadow-xl' 
                        : 'text-cortex-text-muted hover:text-white hover:bg-white/[0.02] border border-transparent'
                    }`}
                  >
                    {isActive && (
                      <>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-cortex-accent shadow-[0_0_15px_var(--color-cortex-accent-glow)]"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-cortex-accent/5 to-transparent"></div>
                      </>
                    )}
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} className={`transition-all duration-300 ${isActive ? 'text-cortex-accent scale-110 drop-shadow-[0_0_8px_var(--color-cortex-accent-glow)]' : 'group-hover:text-white group-hover:scale-105 transition-colors'}`} />
                    <span className={`text-[11px] font-bold tracking-[0.1em] uppercase whitespace-nowrap transition-all ${isActive ? 'text-white' : 'group-hover:translate-x-1'}`}>{t(item.id as TranslationKey)}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            <div className="glass-panel bg-white/[0.01] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-cortex-accent/20 transition-all duration-500">
              <div className="absolute inset-0 shimmer opacity-10"></div>
              <div className="text-[9px] text-cortex-text-muted mb-4 uppercase tracking-[0.3em] font-bold opacity-60">{t('systemHealth')}</div>
              <div className="flex items-end justify-between mb-3">
                <span className="text-[10px] font-bold text-white tracking-[0.1em] uppercase opacity-80">{t('efficiency')}</span>
                <span className="text-2xl font-light text-cortex-success neon-text tracking-tighter">94.2<span className="text-xs ml-0.5 opacity-50">%</span></span>
              </div>
              <div className="w-full bg-black/40 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-cortex-success h-full w-[94.2%] shadow-[0_0_10px_var(--color-cortex-success)] rounded-full relative">
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
