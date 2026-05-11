import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { AuthView } from './AuthPage';

const InputField: React.FC<{
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ icon, type, placeholder, value, onChange }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-200 pointer-events-none">
      {icon}
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 rounded-2xl outline-none transition-all duration-200"
      style={{
        background: 'rgba(0,0,0,0.35)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onFocus={e => {
        e.currentTarget.style.border = '1px solid rgba(0,229,255,0.4)';
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,229,255,0.08), inset 0 0 20px rgba(0,229,255,0.03)';
      }}
      onBlur={e => {
        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    />
  </div>
);

export const ForgotPasswordForm: React.FC<{ onSwitchView: (v: AuthView) => void }> = ({ onSwitchView }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter your corporate email');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-white tracking-tight">Identity Recovery</h2>
        <p className="text-xs text-slate-500 tracking-wide">Secure access restoration system</p>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-[11px] text-slate-400 text-center px-4 leading-relaxed">
              Enter your registered corporate email address to receive a secure password reset protocol.
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest"
                style={{
                  background: 'rgba(255,23,68,0.08)',
                  border: '1px solid rgba(255,23,68,0.25)',
                  color: '#ff1744',
                }}
              >
                <ShieldAlert size={14} />
                {error}
              </motion.div>
            )}

            <InputField
              icon={<Mail size={16} />}
              type="email"
              placeholder="Corporate Email"
              value={email}
              onChange={setEmail}
            />

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-2xl font-bold text-[12px] tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-wait"
              style={{
                background: '#00e5ff',
                color: '#000',
                boxShadow: '0 0 30px rgba(0,229,255,0.3)',
              }}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span>Send Protocol</span>
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} className="text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Protocol Transmitted</h3>
              <p className="text-xs text-slate-500 px-4 leading-relaxed">
                A security restoration link has been dispatched to <span className="text-cyan-400 font-medium">{email}</span>. Please check your inbox.
              </p>
            </div>
            <div className="pt-2">
              <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                Verification expires in 15:00
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => onSwitchView('login')}
        className="w-full flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 hover:text-white transition-colors py-2"
      >
        <ArrowLeft size={14} />
        Back to Authentication
      </button>
    </motion.div>
  );
};
