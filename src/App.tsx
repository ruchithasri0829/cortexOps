import { MainLayout } from './layout/MainLayout';
import { ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { BuilderMode } from './components/BuilderMode';
import { AlarmPanel } from './components/AlarmPanel';
import { DigitalTwinTab } from './components/dashboard/DigitalTwinTab';
import { AnalyticsTab } from './components/dashboard/AnalyticsTab';
import { ShiftHandoverTab } from './components/dashboard/ShiftHandoverTab';
import { useUiStore } from './store/uiStore';
import { useAuthStore } from './store/authStore';
import { AuthPage } from './components/auth/AuthPage';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

function App() {
  const { isEmergency, toggleEmergency, activeTab } = useUiStore();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <AuthPage />;
  }


  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'processes':
        return <DigitalTwinTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'alerts':
        return <AlarmPanel />;
      case 'builder':
        return <BuilderMode />;
      case 'settings':
        return <ShiftHandoverTab />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <MainLayout>
      <motion.div 
        className="h-full flex flex-col space-y-6 max-w-[1600px] mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
          <motion.div layout>
            {isEmergency ? (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-2">
                <div className="px-3 py-1.5 rounded-md bg-cortex-danger/20 border border-cortex-danger text-cortex-danger text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                  <ShieldAlert size={12} className="animate-pulse" />
                  EMERGENCY OVERRIDE
                </div>
                <span className="text-[10px] tracking-[0.2em] text-cortex-danger font-mono uppercase font-bold animate-pulse">CRITICAL CASCADE FAILURE</span>
              </motion.div>
            ) : (
              <div className="flex items-center gap-3 mb-2">
                <div className="px-2.5 py-1 rounded-md bg-cortex-accent/10 border border-cortex-accent/20 text-cortex-accent text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cortex-accent animate-pulse"></div>
                  Live Status
                </div>
                <span className="text-[10px] tracking-[0.2em] text-cortex-text-muted font-mono uppercase">SYS-ID: CTX-9042</span>
              </div>
            )}
            
            <h1 className="text-4xl font-light text-white tracking-tight">
              {activeTab === 'dashboard' && <>Plant <span className="font-semibold">Overview</span></>}
              {activeTab === 'processes' && <>Digital <span className="font-semibold">Twin</span></>}
              {activeTab === 'analytics' && <>Data <span className="font-semibold">Intelligence</span></>}
              {activeTab === 'alerts' && <>Active <span className="font-semibold">Alarms</span></>}
              {activeTab === 'builder' && <>HMI <span className="font-semibold">Builder</span></>}
              {activeTab === 'settings' && <>Shift <span className="font-semibold">Handover</span></>}
            </h1>
            <p className="text-sm text-cortex-text-muted mt-2 tracking-wide">
              {activeTab === 'dashboard' && 'Real-time telemetry and advanced control diagnostics'}
              {activeTab === 'processes' && 'Synchronized virtual asset modeling and health scoring'}
              {activeTab === 'analytics' && 'Predictive trends and historical incident reconstruction'}
              {activeTab === 'alerts' && 'Centralized monitoring for all system level criticalities'}
              {activeTab === 'builder' && 'Drag and drop components to build custom industrial interfaces'}
              {activeTab === 'settings' && 'Personnel management, scheduling, and operational logs'}
            </p>
          </motion.div>
          <motion.div layout className="flex space-x-4 mb-2">
            {!isEmergency && (
              <button className="glass-panel-interactive px-5 py-2.5 rounded-xl text-cortex-text hover:text-white transition-all duration-300 font-medium text-sm tracking-wide active:scale-95">
                Generate Report
              </button>
            )}
            <motion.button 
              onClick={toggleEmergency}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide flex items-center gap-2 transition-all duration-300 ${
                isEmergency 
                  ? 'bg-transparent border border-cortex-danger text-cortex-danger hover:bg-cortex-danger hover:text-white shadow-[0_0_20px_rgba(255,23,68,0.3)]' 
                  : 'bg-cortex-accent text-black hover:bg-white hover:shadow-[0_0_20px_var(--color-cortex-accent-glow)]'
              }`}
            >
              <ShieldAlert size={16} />
              {isEmergency ? 'Resolve Incident' : 'Simulate Incident'}
            </motion.button>
          </motion.div>
        </motion.header>

        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </MainLayout>
  );
}

export default App;
