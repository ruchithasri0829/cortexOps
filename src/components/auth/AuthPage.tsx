// CortexOps Authentication Orchestrator - v1.1.0
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { AuthBackground } from './AuthBackground';
import { LeftPanel } from './LeftPanel';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export type AuthView = 'login' | 'signup' | 'forgot-password';

export const AuthPage: React.FC = () => {
  const [view, setView] = useState<AuthView>('login');
  const { isLoading } = useAuthStore();

  return (
    <div className="min-h-screen w-full flex overflow-hidden relative">
      <AuthBackground />

      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[58%] relative flex-col">
        <LeftPanel />
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-[45%] xl:w-[42%] flex items-center justify-center p-6 sm:p-10 relative z-10">
        {/* Vertical separator */}
        <div className="hidden lg:block absolute left-0 top-[10%] h-[80%] w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />

        <div className="w-full max-w-[420px]">
          {/* Mini logo for mobile / top of form */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8 lg:hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#00e5ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-lg font-light tracking-[0.15em] text-white">
              CORTEX<span className="font-bold text-cyan-400">OPS</span>
            </span>
          </motion.div>

          {/* Glass card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(8, 11, 22, 0.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(0,229,255,0.12)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

            {/* Form area */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {view === 'login' && <LoginForm key="login" onSwitchView={setView} />}
                {view === 'signup' && <SignupForm key="signup" onSwitchView={setView} />}
                {view === 'forgot-password' && <ForgotPasswordForm key="forgot" onSwitchView={setView} />}
              </AnimatePresence>
            </div>

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6 text-[10px] text-slate-600 uppercase tracking-[0.2em] font-medium"
          >
            Secured by Cortex Shield · Enterprise Edition 2026
          </motion.p>
        </div>
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(4,6,15,0.7)', backdropFilter: 'blur(8px)' }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-400/70">
                Authenticating...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
