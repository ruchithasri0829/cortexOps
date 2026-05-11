import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { Mail, KeyRound, Eye, EyeOff, Check, ShieldAlert, ArrowRight, Loader2, Apple } from 'lucide-react';
import type { AuthView } from './AuthPage';

/* ── Social / SSO provider icons ── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.705 17.64 9.2z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M0 0h8.571v8.571H0z" fill="#F25022"/>
    <path d="M9.429 0H18v8.571H9.429z" fill="#7FBA00"/>
    <path d="M0 9.429h8.571V18H0z" fill="#00A4EF"/>
    <path d="M9.429 9.429H18V18H9.429z" fill="#FFB900"/>
  </svg>
);

const AppleIcon = () => <Apple size={18} className="text-white" />;


const OktaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 50 50" fill="none">
    <circle cx="25" cy="25" r="25" fill="#007DC1"/>
    <circle cx="25" cy="25" r="10" fill="white"/>
  </svg>
);

const SamlIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#6366f1"/>
    <path d="M4 12h16M12 4v16M7 7l10 10M17 7L7 17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* ── SSO Provider data ── */
const providers = [
  { id: 'google',    label: 'Google Workspace',   sub: 'Continue with Google SSO',    Icon: GoogleIcon,    glow: 'rgba(66,133,244,0.3)' },
  { id: 'microsoft', label: 'Microsoft Entra ID', sub: 'Azure AD / M365 identity',    Icon: MicrosoftIcon, glow: 'rgba(0,164,239,0.3)'  },
  { id: 'apple',     label: 'Apple Sign In',       sub: 'Secure Apple identity',        Icon: AppleIcon,     glow: 'rgba(255,255,255,0.15)'},
  { id: 'okta',      label: 'Okta SSO',            sub: 'Okta workforce identity',      Icon: OktaIcon,      glow: 'rgba(0,125,193,0.35)' },
  { id: 'saml',      label: 'Enterprise SSO',      sub: 'SAML 2.0 / Custom IdP',        Icon: SamlIcon,      glow: 'rgba(99,102,241,0.35)'},
];

/* ── Input field ── */
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

/* ── Provider Card ── */
const ProviderCard: React.FC<{ provider: typeof providers[0]; onSelect: (id: string) => void; loading: string | null }> = ({ provider, onSelect, loading }) => {
  const isLoading = loading === provider.id;
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(provider.id)}
      disabled={!!loading}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left relative overflow-hidden group disabled:opacity-50 disabled:cursor-wait transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.border = `1px solid ${provider.glow.replace('0.3','0.5').replace('0.15','0.3').replace('0.35','0.5')}`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${provider.glow}, inset 0 0 20px rgba(0,0,0,0.2)`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.07)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
        {isLoading ? <Loader2 size={16} className="text-cyan-400 animate-spin" /> : <provider.Icon />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-white/90 leading-none mb-0.5">{provider.label}</p>
        <p className="text-[10px] text-slate-600 truncate">{provider.sub}</p>
      </div>
      <ArrowRight size={14} className="text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
    </motion.button>
  );
};

/* ── Mock SSO Modal ── */
const SSOModal: React.FC<{ provider: string; onClose: () => void }> = ({ provider, onClose }) => {
  const [step, setStep] = useState<'redirecting' | 'auth' | 'success'>('redirecting');
  const { login } = useAuthStore();

  React.useEffect(() => {
    const t1 = setTimeout(() => setStep('auth'), 1200);
    const t2 = setTimeout(() => setStep('success'), 2800);
    const t3 = setTimeout(() => {
      login({ id: 'sso-' + Math.random().toString(36).substr(2,8), name: 'Enterprise User', email: `user@${provider}.com`, role: 'operator', avatar: '' });
    }, 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [provider, login]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(4,6,15,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm p-8 rounded-3xl flex flex-col items-center text-center gap-6"
        style={{ background: 'rgba(8,11,22,0.97)', border: '1px solid rgba(0,229,255,0.15)', boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)' }}>
          <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-400/60 mb-2">
            {step === 'redirecting' ? 'Connecting to provider...' : step === 'auth' ? 'Verifying identity...' : 'Authentication success'}
          </p>
          <h3 className="text-lg font-semibold text-white capitalize">{provider} SSO</h3>
          <p className="text-xs text-slate-500 mt-1">Secure enterprise authentication in progress</p>
        </div>
        <div className="flex gap-2">
          {['redirecting', 'auth', 'success'].map((s, i) => (
            <div key={s} className="w-2 h-2 rounded-full transition-all duration-300"
              style={{ background: ['redirecting', 'auth', 'success'].indexOf(step) >= i ? '#00e5ff' : 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>
        <button onClick={onClose} className="text-[10px] text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors">
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
};

/* ── Main Login Form ── */
export const LoginForm: React.FC<{ onSwitchView: (v: AuthView) => void }> = ({ onSwitchView }) => {
  const { login, setLoading, isLoading, error, setError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<string | null>(null);
  const [ssoModal, setSsoModal] = useState<string | null>(null);

  const handleSSOClick = (id: string) => {
    setSsoLoading(id);
    setTimeout(() => { setSsoLoading(null); setSsoModal(id); }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) { setError('Please provide all credentials'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Invalid email format'); return; }
    setLoading(true);
    setTimeout(() => {
      login({ id: 'usr-' + Math.random().toString(36).substr(2,9), email, name: email.split('@')[0], role: 'operator', avatar: '' });
    }, 1500);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }} className="space-y-6">

        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500 tracking-wide">Sign in to access your industrial workspace</p>
        </div>

        {/* SSO Providers */}
        <div className="space-y-2">
          {providers.slice(0, 3).map(p => (
            <ProviderCard key={p.id} provider={p} onSelect={handleSSOClick} loading={ssoLoading} />
          ))}
          <div className="grid grid-cols-2 gap-2">
            {providers.slice(3).map(p => (
              <ProviderCard key={p.id} provider={p} onSelect={handleSSOClick} loading={ssoLoading} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/5" />
          <button onClick={() => setShowEmailForm(!showEmailForm)}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1">
            <Mail size={12} />
            {showEmailForm ? 'Hide email form' : 'Continue with Email'}
          </button>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* Email Form */}
        <AnimatePresence>
          {showEmailForm && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}
              className="space-y-3 overflow-hidden"
            >
              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest"
                  style={{ background: 'rgba(255,23,68,0.08)', border: '1px solid rgba(255,23,68,0.25)', color: '#ff1744' }}>
                  <ShieldAlert size={14} />{error}
                </motion.div>
              )}
              <InputField icon={<Mail size={16}/>} type="email" placeholder="Email Address" value={email} onChange={setEmail} />
              <InputField
                icon={<KeyRound size={16}/>} type={showPw ? 'text' : 'password'} placeholder="Password" value={password} onChange={setPassword}
                right={
                  <button type="button" onClick={() => setShowPw(!showPw)} className="text-slate-500 hover:text-white transition-colors">
                    {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                }
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div onClick={() => setRemember(!remember)}
                    className="w-4 h-4 rounded-md border flex items-center justify-center transition-all cursor-pointer"
                    style={{ background: remember ? '#00e5ff' : 'transparent', borderColor: remember ? '#00e5ff' : 'rgba(255,255,255,0.15)' }}>
                    {remember && <Check size={10} className="text-black font-bold"/>}
                  </div>
                  <span className="text-[11px] text-slate-500 group-hover:text-white transition-colors">Remember me</span>
                </label>
                <button type="button" onClick={() => onSwitchView('forgot-password')}
                  className="text-[11px] font-semibold text-slate-500 hover:text-cyan-400 transition-colors">
                  Forgot password?
                </button>
              </div>
              <motion.button type="submit" disabled={isLoading}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-2xl font-bold text-[12px] tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-wait"
                style={{ background: '#00e5ff', color: '#000', boxShadow: '0 0 30px rgba(0,229,255,0.3)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(0,229,255,0.5)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(0,229,255,0.3)'; }}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin"/> : <><span>Sign In</span><ArrowRight size={16} /></>}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center text-[11px] text-slate-600">
          No account?{' '}
          <button type="button" onClick={() => onSwitchView('signup')} className="text-cyan-400 font-semibold hover:underline ml-1">
            Create Profile
          </button>
        </p>
      </motion.div>

      {/* SSO Modal */}
      <AnimatePresence>
        {ssoModal && <SSOModal provider={ssoModal} onClose={() => setSsoModal(null)} />}
      </AnimatePresence>
    </>
  );
};
