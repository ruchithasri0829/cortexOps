import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { Mail, KeyRound, User, Briefcase, Eye, EyeOff, ShieldAlert, ArrowRight, Loader2, Check } from 'lucide-react';
import type { AuthView } from './AuthPage';
import type { UserRole } from '../../store/authStore';

const roles: { id: UserRole; label: string; desc: string }[] = [
  { id: 'admin', label: 'Administrator', desc: 'Full system control & oversight' },
  { id: 'supervisor', label: 'Supervisor', desc: 'Process monitoring & team management' },
  { id: 'operator', label: 'Operator', desc: 'Daily plant operations & monitoring' },
  { id: 'maintenance', label: 'Maintenance', desc: 'Equipment servicing & diagnostics' },
];

const InputField: React.FC<{
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  right?: React.ReactNode;
}> = ({ icon, type, placeholder, value, onChange, right }) => (
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
    {right && (
      <div className="absolute right-4 top-1/2 -translate-y-1/2">{right}</div>
    )}
  </div>
);

export const SignupForm: React.FC<{ onSwitchView: (v: AuthView) => void }> = ({ onSwitchView }) => {
  const { login, setLoading, isLoading, error, setError } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('operator');
  const [showPw, setShowPw] = useState(false);
  const [showRoles, setShowRoles] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    // Simulate signup
    setTimeout(() => {
      login({
        id: 'usr-' + Math.random().toString(36).substr(2, 9),
        email,
        name,
        role,
        avatar: '',
      });
    }, 1500);
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
        <h2 className="text-2xl font-bold text-white tracking-tight">Create Account</h2>
        <p className="text-xs text-slate-500 tracking-wide">Register your industrial identity profile</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
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
          icon={<User size={16} />}
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={setName}
        />

        <InputField
          icon={<Mail size={16} />}
          type="email"
          placeholder="Corporate Email"
          value={email}
          onChange={setEmail}
        />

        {/* Role Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowRoles(!showRoles)}
            className="w-full py-3.5 px-4 pl-11 text-sm text-left text-white rounded-2xl outline-none transition-all duration-200 flex items-center justify-between"
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <Briefcase size={16} />
            </div>
            <span className={role ? 'text-white' : 'text-slate-600'}>
              {roles.find(r => r.id === role)?.label || 'Select Role'}
            </span>
            <ArrowRight size={14} className={`text-slate-600 transition-transform ${showRoles ? 'rotate-90' : ''}`} />
          </button>

          <AnimatePresence>
            {showRoles && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute top-full left-0 right-0 mt-2 z-20 rounded-2xl overflow-hidden p-1"
                style={{
                  background: 'rgba(15, 20, 35, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,229,255,0.2)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                }}
              >
                {roles.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setRole(r.id);
                      setShowRoles(false);
                    }}
                    className="w-full p-3 text-left rounded-xl hover:bg-cyan-500/10 transition-colors group flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-cyan-400">{r.label}</p>
                      <p className="text-[10px] text-slate-500">{r.desc}</p>
                    </div>
                    {role === r.id && <Check size={14} className="text-cyan-400" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <InputField
          icon={<KeyRound size={16} />}
          type={showPw ? 'text' : 'password'}
          placeholder="Security Password"
          value={password}
          onChange={setPassword}
          right={
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 mt-4 rounded-2xl font-bold text-[12px] tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-wait"
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
              <span>Initialize Profile</span>
              <ArrowRight size={16} />
            </>
          )}
        </motion.button>
      </form>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700">Or</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <p className="text-center text-[11px] text-slate-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onSwitchView('login')}
            className="text-cyan-400 font-semibold hover:underline ml-1"
          >
            Sign In Here
          </button>
        </p>
      </div>
    </motion.div>
  );
};
