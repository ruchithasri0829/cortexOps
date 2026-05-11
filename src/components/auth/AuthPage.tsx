import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { 
  Cpu, Mail, User as UserIcon, ShieldAlert, KeyRound, 
  ArrowRight, Eye, EyeOff, Check, Chrome, Github, 
  Lock, Globe, Terminal, Loader2
} from 'lucide-react';
import { AuthBackground } from './AuthBackground';

type AuthView = 'welcome' | 'login' | 'signup' | 'forgot-password';

export const AuthPage: React.FC = () => {
  const [view, setView] = useState<AuthView>('welcome');
  const { t } = useUiStore();
  const { error, setError } = useAuthStore();

  useEffect(() => {
    // Show welcome screen for 2 seconds then transition to login
    const timer = setTimeout(() => {
      if (view === 'welcome') setView('login');
    }, 2500);
    return () => clearTimeout(timer);
  }, [view]);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-cortex-text flex items-center justify-center relative overflow-hidden">
      <AuthBackground />

      <div className="w-full max-w-[440px] p-6 relative z-10">
        <AnimatePresence mode="wait">
          {view === 'welcome' ? (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              className="flex flex-col items-center text-center"
            >
              <motion.div 
                animate={{ 
                  boxShadow: ["0 0 20px rgba(0,229,255,0.2)", "0 0 50px rgba(0,229,255,0.4)", "0 0 20px rgba(0,229,255,0.2)"],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-[2rem] bg-cortex-accent/10 border border-cortex-accent/30 flex items-center justify-center mb-8 relative"
              >
                <div className="absolute inset-0 rounded-[2rem] border border-cortex-accent/20 animate-ping opacity-20"></div>
                <Cpu size={48} className="text-cortex-accent" />
              </motion.div>
              
              <h1 className="text-5xl font-light tracking-[0.3em] text-white mb-4">
                CORTEX<span className="font-bold text-cortex-accent neon-text ml-2">OPS</span>
              </h1>
              <p className="text-sm uppercase tracking-[0.4em] text-cortex-text-muted font-bold opacity-60">
                Industrial Intelligence Systems
              </p>
              
              <div className="mt-12 flex items-center gap-3 text-[10px] font-mono text-cortex-accent/60 tracking-widest uppercase">
                <Loader2 size={14} className="animate-spin" />
                Initializing Neural Interface...
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="auth-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            >
              <div className="mb-8 text-center flex flex-col items-center">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-8 h-8 rounded-xl bg-cortex-accent/10 border border-cortex-accent/30 flex items-center justify-center">
                      <Cpu size={18} className="text-cortex-accent" />
                   </div>
                   <span className="text-xl font-light tracking-[0.2em] text-white">
                     CORTEX<span className="font-bold text-cortex-accent">OPS</span>
                   </span>
                </div>
              </div>

              <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cortex-accent/30 to-transparent"></div>
                
                <AnimatePresence mode="wait">
                  {view === 'login' && <LoginForm key="login" onSwitchView={setView} />}
                  {view === 'signup' && <SignupForm key="signup" onSwitchView={setView} />}
                  {view === 'forgot-password' && <ForgotPasswordForm key="forgot" onSwitchView={setView} />}
                </AnimatePresence>
              </div>
              
              <div className="mt-8 text-center">
                 <p className="text-[10px] text-cortex-text-muted uppercase tracking-[0.2em] font-bold opacity-40">
                   Secured by Cortex Shield &copy; 2026 Enterprise Edition
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 LOGIN FORM                                 */
/* -------------------------------------------------------------------------- */

function LoginForm({ onSwitchView }: { onSwitchView: (v: AuthView) => void }) {
  const { login, setLoading, isLoading, error, setError } = useAuthStore();
  const { t } = useUiStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Please provide all credentials');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      login({
        id: 'usr-' + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        role: 'operator',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      });
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      className="flex flex-col space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Welcome Back</h2>
        <p className="text-xs text-cortex-text-muted tracking-wide">Enter your credentials to access the terminal</p>
      </div>

      {/* Social Login */}
      <div className="grid grid-cols-2 gap-3">
         <button className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all text-[11px] font-bold uppercase tracking-wider text-white/80">
            <Chrome size={16} className="text-white/60" />
            Google
         </button>
         <button className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all text-[11px] font-bold uppercase tracking-wider text-white/80">
            <Globe size={16} className="text-white/60" />
            Microsoft
         </button>
      </div>

      <div className="relative flex items-center py-2">
         <div className="flex-grow border-t border-white/5"></div>
         <span className="flex-shrink mx-4 text-[9px] text-cortex-text-muted uppercase tracking-[0.2em] font-bold">Or continue with</span>
         <div className="flex-grow border-t border-white/5"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-3 rounded-2xl bg-cortex-danger/10 border border-cortex-danger/30 text-cortex-danger text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert size={14} />
            {error}
          </motion.div>
        )}

        <div className="space-y-3">
          <div className="relative group">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cortex-text-muted group-focus-within:text-cortex-accent transition-colors" />
            <input 
              type="email" placeholder="Email Address"
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-cortex-text-muted/40 focus:outline-none focus:border-cortex-accent/50 focus:ring-1 focus:ring-cortex-accent/50 transition-all"
            />
          </div>
          <div className="relative group">
            <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cortex-text-muted group-focus-within:text-cortex-accent transition-colors" />
            <input 
              type={showPassword ? "text" : "password"} placeholder="Access Code"
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-sm text-white placeholder:text-cortex-text-muted/40 focus:outline-none focus:border-cortex-accent/50 focus:ring-1 focus:ring-cortex-accent/50 transition-all"
            />
            <button 
              type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-cortex-text-muted hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-1">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${remember ? 'bg-cortex-accent border-cortex-accent' : 'border-white/20 group-hover:border-cortex-accent/50'}`}>
              {remember && <Check size={12} className="text-black font-bold" />}
            </div>
            <input type="checkbox" className="hidden" checked={remember} onChange={() => setRemember(!remember)} />
            <span className="text-cortex-text-muted group-hover:text-white transition-colors tracking-wide font-medium">Remember me</span>
          </label>
          <button type="button" onClick={() => onSwitchView('forgot-password')} className="text-cortex-text-muted hover:text-cortex-accent transition-colors font-bold uppercase tracking-wider">
            Forgot Password?
          </button>
        </div>

        <button 
          type="submit" disabled={isLoading}
          className="w-full py-4 bg-cortex-accent text-black font-bold rounded-2xl text-[11px] tracking-[0.2em] uppercase hover:bg-white transition-all shadow-[0_0_20px_var(--color-cortex-accent-glow)] flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-wait"
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-4 border-t border-white/5">
        <span className="text-[11px] text-cortex-text-muted tracking-wide font-medium">
          New Operative? {' '}
          <button type="button" onClick={() => onSwitchView('signup')} className="text-cortex-accent hover:underline font-bold uppercase ml-1 tracking-wider">Create Profile</button>
        </span>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                SIGNUP FORM                                 */
/* -------------------------------------------------------------------------- */

function SignupForm({ onSwitchView }: { onSwitchView: (v: AuthView) => void }) {
  const { signup, setLoading, isLoading, error, setError } = useAuthStore();
  const { t } = useUiStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('operator');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError('Operational profile incomplete');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return;
    }

    if (password.length < 8) {
      setError('Access code must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Access codes do not match');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      signup({
        id: 'usr-' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      });
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="flex flex-col space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Create Profile</h2>
        <p className="text-xs text-cortex-text-muted tracking-wide">Register your operative credentials</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-3 rounded-2xl bg-cortex-danger/10 border border-cortex-danger/30 text-cortex-danger text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert size={14} />
            {error}
          </motion.div>
        )}

        <div className="space-y-3">
          <div className="relative group">
            <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cortex-text-muted group-focus-within:text-cortex-accent transition-colors" />
            <input 
              type="text" placeholder="Full Name"
              value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-cortex-text-muted/40 focus:outline-none focus:border-cortex-accent/50 focus:ring-1 focus:ring-cortex-accent/50 transition-all"
            />
          </div>
          <div className="relative group">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cortex-text-muted group-focus-within:text-cortex-accent transition-colors" />
            <input 
              type="email" placeholder="Email Address"
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-cortex-text-muted/40 focus:outline-none focus:border-cortex-accent/50 focus:ring-1 focus:ring-cortex-accent/50 transition-all"
            />
          </div>
          <div className="relative group">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cortex-text-muted group-focus-within:text-cortex-accent transition-colors" />
            <input 
              type={showPassword ? "text" : "password"} placeholder="Access Code (Min 8 chars)"
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-sm text-white placeholder:text-cortex-text-muted/40 focus:outline-none focus:border-cortex-accent/50 focus:ring-1 focus:ring-cortex-accent/50 transition-all"
            />
            <button 
              type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-cortex-text-muted hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="relative group">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cortex-text-muted group-focus-within:text-cortex-accent transition-colors" />
            <input 
              type={showPassword ? "text" : "password"} placeholder="Confirm Access Code"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-cortex-text-muted/40 focus:outline-none focus:border-cortex-accent/50 focus:ring-1 focus:ring-cortex-accent/50 transition-all"
            />
          </div>
          
          <div className="relative group">
            <Terminal size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cortex-text-muted group-focus-within:text-cortex-accent transition-colors" />
            <select 
              value={role} onChange={e => setRole(e.target.value as UserRole)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white appearance-none focus:outline-none focus:border-cortex-accent/50 focus:ring-1 focus:ring-cortex-accent/50 transition-all cursor-pointer"
            >
              <option value="operator" className="bg-[#0a0a0c]">Operative: Basic Access</option>
              <option value="maintenance" className="bg-[#0a0a0c]">Maintenance: Asset Control</option>
              <option value="supervisor" className="bg-[#0a0a0c]">Supervisor: Node Management</option>
              <option value="admin" className="bg-[#0a0a0c]">Admin: Full System Authority</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" disabled={isLoading}
          className="w-full py-4 bg-white/5 border border-cortex-accent/40 text-cortex-accent font-bold rounded-2xl text-[11px] tracking-[0.2em] uppercase hover:bg-cortex-accent hover:text-black transition-all shadow-[0_0_15px_rgba(0,229,255,0.1)] hover:shadow-[0_0_20px_var(--color-cortex-accent-glow)] flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-wait"
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              Initialize Profile
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-4 border-t border-white/5">
        <span className="text-[11px] text-cortex-text-muted tracking-wide font-medium">
          Already Registered? {' '}
          <button type="button" onClick={() => onSwitchView('login')} className="text-cortex-accent hover:underline font-bold uppercase ml-1 tracking-wider">Access Terminal</button>
        </span>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            FORGOT PASSWORD FORM                            */
/* -------------------------------------------------------------------------- */

function ForgotPasswordForm({ onSwitchView }: { onSwitchView: (v: AuthView) => void }) {
  const { setError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center space-y-6 py-6">
        <div className="w-20 h-20 rounded-full bg-cortex-success/10 flex items-center justify-center border border-cortex-success/30 shadow-[0_0_30px_rgba(0,230,118,0.2)]">
          <Check size={40} className="text-cortex-success" />
        </div>
        <div>
           <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Override Dispatched</h2>
           <p className="text-[11px] text-cortex-text-muted leading-relaxed max-w-[240px] mx-auto">
             A secure recovery link has been sent to your terminal. Check your encrypted messages.
           </p>
        </div>
        <button 
          onClick={() => onSwitchView('login')}
          className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
        >
          Return to Login
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="flex flex-col space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Access Recovery</h2>
        <p className="text-xs text-cortex-text-muted tracking-wide">Enter your terminal ID to reset access</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cortex-text-muted group-focus-within:text-cortex-accent transition-colors" />
          <input 
            type="email" required placeholder="Operative Email"
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-cortex-text-muted/40 focus:outline-none focus:border-cortex-accent/50 focus:ring-1 focus:ring-cortex-accent/50 transition-all"
          />
        </div>

        <button 
          type="submit" disabled={loading}
          className="w-full py-4 bg-cortex-warning/10 border border-cortex-warning/40 text-cortex-warning font-bold rounded-2xl text-[11px] tracking-[0.2em] uppercase hover:bg-cortex-warning hover:text-black transition-all shadow-[0_0_20px_rgba(255,179,0,0.1)] hover:shadow-[0_0_25px_rgba(255,179,0,0.3)] flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-wait"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              Request Override
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <button type="button" onClick={() => onSwitchView('login')} className="text-[10px] text-cortex-text-muted hover:text-cortex-accent transition-colors font-bold uppercase tracking-widest">
          Cancel Recovery
        </button>
      </div>
    </motion.div>
  );
}
