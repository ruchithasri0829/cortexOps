import React, { useState } from 'react';
import { Menu, Bell, Settings, User, Maximize, Check, Clock, Info, ShieldAlert } from 'lucide-react';
import { useUiStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import type { Language } from '../i18n/translations';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';

export const Topbar: React.FC = () => {
  const { 
    toggleSidebar, toggleRightPanel, setActiveTab, 
    language, setLanguage, toggleFullscreen, isFullscreen,
    notifications, markNotificationAsRead, clearNotifications, t
  } = useUiStore();

  const { isAuthenticated, user, logout } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    setShowProfile(false);
  };

  return (
    <header className="h-20 flex items-center justify-between px-8 glass-panel border-b border-white/5 border-x-0 border-t-0 z-50 shrink-0 sticky top-0 backdrop-blur-3xl">
      <div className="flex items-center space-x-6">
        <button 
          onClick={toggleSidebar}
          className="p-3 -ml-2 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-cortex-accent/10 hover:border-cortex-accent/30 transition-all duration-300 text-cortex-text-muted hover:text-cortex-accent group"
        >
          <Menu size={20} className="group-hover:scale-110 transition-transform" />
        </button>
        <div className="flex flex-col">
          <span className="text-2xl font-light tracking-[0.25em] text-white flex items-center">
            CORTEX<span className="font-bold text-cortex-accent neon-text ml-1.5">OPS</span>
          </span>
          <div className="text-[8px] font-bold text-cortex-text-muted uppercase tracking-[0.4em] mt-1 opacity-50">Industrial AI Command</div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden lg:flex items-center space-x-6 mr-8">
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-cortex-text-muted uppercase tracking-[0.2em] mb-1 opacity-60">Global Status</span>
              <div className="flex items-center space-x-2 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-cortex-success shadow-[0_0_8px_var(--color-cortex-success)] animate-pulse"></span>
                <span className="text-[9px] font-bold text-white uppercase tracking-widest">Grid Synchronized</span>
              </div>
           </div>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-3 rounded-2xl border transition-all duration-300 group ${showNotifications ? 'bg-cortex-accent border-cortex-accent text-black shadow-[0_0_15px_var(--color-cortex-accent-glow)]' : 'bg-white/[0.02] border-white/5 text-cortex-text-muted hover:text-white hover:border-white/20'}`}
          >
            <Bell size={18} className={showNotifications ? '' : 'group-hover:rotate-12 transition-transform'} />
            {unreadCount > 0 && (
              <span className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full border-2 border-black ${showNotifications ? 'bg-white' : 'bg-cortex-danger shadow-[0_0_8px_var(--color-cortex-danger)]'}`}></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-96 glass-panel border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden rounded-3xl"
                >
                  <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.03]">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-80">{t('notifications')}</span>
                    <button onClick={clearNotifications} className="text-[9px] text-cortex-text-muted hover:text-cortex-accent uppercase tracking-widest font-bold transition-colors">{t('clearAll')}</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-12 text-center flex flex-col items-center">
                         <Bell size={24} className="text-white/10 mb-4" />
                         <span className="text-[10px] text-cortex-text-muted uppercase tracking-[0.2em] font-bold">{t('noNotifications')}</span>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} onClick={() => markNotificationAsRead(n.id)} className={`p-5 border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer group relative ${n.read ? 'opacity-40' : ''}`}>
                          {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cortex-accent shadow-[0_0_10px_var(--color-cortex-accent-glow)]"></div>}
                          <div className="flex gap-4">
                             <div className={`mt-0.5 p-2 rounded-xl bg-black/40 border border-white/5 ${n.type === 'error' ? 'text-cortex-danger' : n.type === 'warning' ? 'text-cortex-warning' : 'text-cortex-accent'}`}>
                                {n.type === 'error' ? <ShieldAlert size={16} /> : n.type === 'warning' ? <Info size={16} /> : <Check size={16} />}
                             </div>
                             <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-white mb-1">{n.title}</p>
                                <p className="text-[11px] text-cortex-text-muted leading-relaxed mb-3">{n.message}</p>
                                <span className="text-[9px] font-mono text-cortex-text-muted flex items-center gap-1.5 uppercase tracking-widest opacity-60">
                                   <Clock size={10} /> {new Date(n.timestamp).toLocaleTimeString()}
                                </span>
                             </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <button onClick={() => { setActiveTab('alerts'); setShowNotifications(false); }} className="w-full py-4 bg-white/[0.02] hover:bg-white/[0.05] text-[10px] text-cortex-accent font-bold uppercase tracking-[0.2em] transition-all border-t border-white/5 group">
                     <span className="group-hover:tracking-[0.3em] transition-all">{t('viewAllActivity' as any) || 'View All Activity'}</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={toggleFullscreen}
          className={`p-3 rounded-2xl border transition-all duration-300 active:scale-95 group ${isFullscreen ? 'bg-cortex-accent/20 border-cortex-accent/40 text-cortex-accent shadow-[0_0_15px_var(--color-cortex-accent-glow)]' : 'bg-white/[0.02] border-white/5 text-cortex-text-muted hover:text-white hover:border-white/20'}`}
          title={t('fullscreen')}
        >
          <Maximize size={18} className="group-hover:scale-110 transition-transform" />
        </button>
        
        <div className="relative group">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="appearance-none bg-white/[0.02] border border-white/5 rounded-2xl pl-5 pr-10 py-3 text-[10px] font-bold tracking-[0.2em] text-cortex-text-muted hover:text-white hover:border-white/20 transition-all cursor-pointer outline-none uppercase"
          >
            <option value="en">EN</option>
            <option value="hi">हिन्दी</option>
            <option value="te">తెలుగు</option>
            <option value="ja">日本語</option>
            <option value="de">DE</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cortex-text-muted group-hover:text-cortex-accent transition-colors">
             <Settings size={12} className="animate-spin-slow" />
          </div>
        </div>

        <button 
          onClick={toggleRightPanel}
          className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 text-cortex-text-muted hover:text-white group"
        >
          <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className={`flex items-center gap-3 pl-1 pr-4 py-1 rounded-2xl border transition-all duration-500 group ${showProfile ? 'bg-white/[0.05] border-cortex-accent/50' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}
          >
            <div className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-500 ${showProfile ? 'bg-cortex-accent shadow-[0_0_20px_var(--color-cortex-accent-glow)]' : 'bg-cortex-accent/10 border border-cortex-accent/20'}`}>
              {isAuthenticated && user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={20} className={showProfile ? 'text-black' : 'text-cortex-accent group-hover:scale-110 transition-transform'} />
              )}
            </div>
            <div className="hidden md:flex flex-col items-start text-left">
               <span className="text-[11px] font-bold text-white tracking-wide uppercase truncate max-w-[100px]">
                 {isAuthenticated ? user?.name : 'Guest'}
               </span>
               <span className="text-[8px] font-bold text-cortex-accent/60 uppercase tracking-[0.2em]">
                 {isAuthenticated ? user?.role : 'Unauthorized'}
               </span>
            </div>
          </button>

          <AnimatePresence>
            {showProfile && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-64 glass-panel border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden rounded-3xl backdrop-blur-3xl"
                >
                  <div className="p-1.5">
                    {isAuthenticated ? (
                      <div className="p-2">
                        <div className="px-4 py-4 mb-2 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0">
                              <img src={user?.avatar} alt="avatar" className="w-full h-full object-cover" />
                           </div>
                           <div className="min-w-0">
                              <p className="text-[12px] font-bold text-white truncate">{user?.name}</p>
                              <p className="text-[9px] text-cortex-accent font-bold uppercase tracking-[0.2em]">{user?.role}</p>
                           </div>
                        </div>
                        <DropdownItem icon={<User size={16} />} label="View Profile" onClick={() => { setActiveTab('dashboard'); setShowProfile(false); }} />
                        <DropdownItem icon={<Settings size={16} />} label="Security Settings" onClick={() => { setActiveTab('settings'); setShowProfile(false); }} />
                        <div className="h-px bg-white/5 my-2 mx-2"></div>
                        <DropdownItem icon={<LogOut size={16} className="rotate-180" />} label="De-authorize" onClick={handleLogout} danger />
                      </div>
                    ) : (
                      <div className="p-2">
                        <DropdownItem icon={<User size={16} />} label={t('login')} onClick={() => { setActiveTab('dashboard'); setShowProfile(false); }} />
                        <div className="mt-1"></div>
                        <DropdownItem icon={<Maximize size={16} />} label={t('signup')} onClick={() => { setActiveTab('dashboard'); setShowProfile(false); }} />
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

const DropdownItem = ({ icon, label, onClick, danger = false }: { icon: React.ReactNode, label: string, onClick: () => void, danger?: boolean }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${danger ? 'text-cortex-danger hover:bg-cortex-danger/10' : 'text-cortex-text-muted hover:text-white hover:bg-white/5'}`}
  >
    <span className={danger ? 'text-cortex-danger' : 'text-cortex-accent'}>{icon}</span>
    {label}
  </button>
);
