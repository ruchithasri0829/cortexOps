import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, ClipboardList, Wrench, ShieldAlert, CheckCircle2, User, Loader2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { useUiStore } from '../../store/uiStore';

export const ShiftHandoverTab: React.FC = () => {
   const { t } = useUiStore();
   const [isCreatingOrder, setIsCreatingOrder] = useState(false);
   const [isFinalizing, setIsFinalizing] = useState(false);

   const handleCreateOrder = () => {
      setIsCreatingOrder(true);
      setTimeout(() => setIsCreatingOrder(false), 2000);
   };

   const handleFinalize = () => {
      setIsFinalizing(true);
      setTimeout(() => setIsFinalizing(false), 2000);
   };

   return (
      <div className="flex flex-col h-full space-y-8">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">

            {/* Maintenance Scheduler */}
            <Card title={t('maintenanceScheduler')} glow className="flex flex-col">
               <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3 text-cortex-accent">
                     <Calendar size={18} strokeWidth={2.5} className="drop-shadow-[0_0_8px_var(--color-cortex-accent-glow)]" />
                     <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">MAY 2026</span>
                  </div>
                  <button className="p-2.5 bg-white/[0.03] rounded-xl border border-white/10 hover:bg-cortex-accent/10 hover:border-cortex-accent/30 transition-all group">
                     <ClipboardList size={16} className="text-cortex-text-muted group-hover:text-cortex-accent transition-colors" />
                  </button>
               </div>
               <div className="flex-1 overflow-y-auto space-y-4 pr-3 custom-scrollbar">
                  {[
                     { date: '12 MAY', task: 'Pump A2 Seal Replace', tech: 'M. Chen', status: 'pending' },
                     { date: '14 MAY', task: 'Filter Mesh Flush', tech: 'S. Knight', status: 'scheduled' },
                     { date: '15 MAY', task: 'Calibration Check', tech: 'AI System', status: 'scheduled' },
                     { date: '18 MAY', task: 'Safety Valve Audit', tech: 'Admin Group', status: 'scheduled' },
                     { date: '22 MAY', task: 'Boiler 1 Refractory', tech: 'Outsourced', status: 'planned' }
                  ].map((item, idx) => (
                     <motion.div
                        key={idx}
                        whileHover={{ x: 4 }}
                        className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-5 group hover:border-cortex-accent/20 hover:bg-white/[0.04] transition-all cursor-pointer relative overflow-hidden"
                     >
                        <div className="absolute inset-0 shimmer opacity-5 group-hover:opacity-10 transition-opacity"></div>
                        <div className="w-14 text-center border-r border-white/10 pr-4 shrink-0">
                           <span className="text-[12px] font-bold text-white block leading-tight tracking-tighter">{item.date.split(' ')[0]}</span>
                           <span className="text-[9px] text-cortex-text-muted font-bold block uppercase tracking-widest">{item.date.split(' ')[1]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                           <span className="text-[13px] font-bold text-white block mb-1 group-hover:text-cortex-accent transition-colors truncate">{item.task}</span>
                           <div className="flex items-center gap-2">
                              <User size={10} className="text-cortex-text-muted" />
                              <span className="text-[10px] text-cortex-text-muted uppercase font-bold tracking-widest">{item.tech}</span>
                           </div>
                        </div>
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.status === 'pending' ? 'bg-cortex-warning shadow-[0_0_10px_var(--color-cortex-warning)] animate-pulse' : 'bg-white/10'}`}></div>
                     </motion.div>
                  ))}
               </div>
               <button
                  onClick={handleCreateOrder}
                  disabled={isCreatingOrder}
                  className={`w-full mt-6 py-4 font-bold rounded-2xl text-[10px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 ${isCreatingOrder ? 'bg-white/5 text-white/40 cursor-wait border border-white/5' : 'bg-cortex-accent text-black hover:bg-white hover:shadow-[0_0_25px_var(--color-cortex-accent-glow)]'}`}
               >
                  {isCreatingOrder ? <Loader2 size={16} className="animate-spin" /> : <Wrench size={16} strokeWidth={2.5} />}
                  {isCreatingOrder ? t('initializingIsolation') : t('createOrder')}
               </button>
            </Card>

            {/* Shift Handover Dashboard */}
            <Card title={t('shiftHandover')} glow className="flex flex-col">
               <div className="mb-8 p-5 rounded-2xl bg-white/[0.03] border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 shimmer opacity-10"></div>
                  <div className="flex justify-between items-center mb-5 relative z-10">
                     <span className="text-[9px] font-bold text-cortex-accent uppercase tracking-[0.3em] opacity-80">Operational Delta</span>
                     <div className="px-2 py-1 rounded bg-black/40 border border-white/10 text-[9px] font-mono text-cortex-accent tracking-widest">06:00 - 14:00</div>
                  </div>
                  <div className="flex justify-between items-end relative z-10">
                     <div>
                        <h4 className="text-white text-xl font-light leading-none mb-2 tracking-tight">Morning <span className="font-bold">Shift</span></h4>
                        <p className="text-[9px] text-cortex-text-muted uppercase tracking-[0.2em] font-bold">Commander: Marcus Vance</p>
                     </div>
                     <div className="text-right">
                        <span className="text-3xl font-light text-cortex-success neon-text tracking-tighter">102<span className="text-sm opacity-50">%</span></span>
                        <p className="text-[8px] text-cortex-text-muted uppercase tracking-[0.2em] font-bold mt-1">Efficiency VS Target</p>
                     </div>
                  </div>
               </div>

               <div className="flex-1 flex flex-col space-y-6">
                  <div>
                     <div className="text-[9px] text-cortex-text-muted uppercase tracking-[0.3em] font-bold mb-4 opacity-60">Strategic Handover Notes</div>
                     <div className="p-5 rounded-2xl bg-black/40 border border-white/5 text-xs text-white/80 leading-relaxed italic relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-cortex-accent/30 rounded-l-2xl"></div>
                        "Plant stabilized after morning pressure spike. Boiler 1 efficiency is nominal. Monitor Pump A2 vibration - AI copilot flagged for seal inspection."
                     </div>
                  </div>

                  <div className="space-y-3">
                     {[
                        { label: 'Safety checklists completed', status: 'success', icon: CheckCircle2 },
                        { label: 'Environmental compliance logged', status: 'success', icon: CheckCircle2 },
                        { label: '1 Maintenance item pending', status: 'warning', icon: ShieldAlert }
                     ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-1">
                           <div className={item.status === 'success' ? 'text-cortex-success' : 'text-cortex-warning'}>
                              <item.icon size={16} />
                           </div>
                           <span className="text-[11px] font-medium text-white/70 tracking-wide">{item.label}</span>
                        </div>
                     ))}
                  </div>
               </div>

               <button
                  onClick={handleFinalize}
                  disabled={isFinalizing}
                  className={`w-full mt-auto py-4 border rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${isFinalizing ? 'bg-cortex-success/10 border-cortex-success/30 text-cortex-success cursor-wait' : 'border-white/10 text-white/70 hover:bg-white/[0.05] hover:text-white hover:border-white/20'}`}
               >
                  {isFinalizing ? <CheckCircle2 size={18} className="animate-bounce" /> : <ShieldAlert size={16} className="opacity-50" />}
                  {isFinalizing ? t('reportFinalized') : t('finalizeReport')}
               </button>
            </Card>

            {/* Operator Activity Logs */}
            <Card title={t('operatorLogs')} className="flex flex-col">
               <div className="flex-1 overflow-y-auto space-y-3 pr-3 custom-scrollbar">
                  {[
                     { user: 'm.vance', action: 'Acknowledged Alarm CTX-902', time: '10:12:05', icon: ShieldAlert, color: 'text-cortex-warning', bg: 'bg-cortex-warning/10' },
                     { user: 'system', action: 'Autonomous Valve Adjust V-102', time: '10:05:42', icon: ClipboardList, color: 'text-cortex-accent', bg: 'bg-cortex-accent/10' },
                     { user: 'm.vance', action: 'Manual Override Pump A2', time: '09:58:12', icon: Wrench, color: 'text-cortex-danger', bg: 'bg-cortex-danger/10' },
                     { user: 'j.smith', action: 'Login Terminal 4', time: '06:00:00', icon: Users, color: 'text-white', bg: 'bg-white/10' },
                     { user: 'system', action: 'Daily Backup Completed', time: '05:30:15', icon: CheckCircle2, color: 'text-cortex-success', bg: 'bg-cortex-success/10' },
                     { user: 's.lee', action: 'Logout Terminal 2', time: '05:25:10', icon: Users, color: 'text-white/50', bg: 'bg-white/5' }
                  ].map((log, idx) => (
                     <motion.div key={idx} whileHover={{ x: 2 }} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5 group">
                        <div className={`p-2.5 rounded-xl ${log.bg} border border-white/5 ${log.color} group-hover:scale-110 transition-transform`}>
                           <log.icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-start mb-1 gap-2">
                              <span className="text-[12px] font-bold text-white truncate leading-tight">{log.action}</span>
                              <span className="text-[9px] font-mono text-cortex-text-muted opacity-60 shrink-0">{log.time}</span>
                           </div>
                           <span className="text-[9px] text-cortex-text-muted font-bold tracking-[0.1em] uppercase opacity-70">Operative ID: <span className="text-white/60">{log.user}</span></span>
                        </div>
                     </motion.div>
                  ))}
               </div>
               <div className="mt-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-cortex-accent/10 border border-cortex-accent/30 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-cortex-accent/10 rounded-full animate-ping opacity-20"></div>
                        <Users size={16} className="text-cortex-accent" />
                     </div>
                     <div>
                        <span className="text-xs text-white font-bold block mb-0.5 tracking-tight">3 Operators</span>
                        <span className="text-[9px] text-cortex-text-muted uppercase font-bold tracking-[0.15em] opacity-60">Active Session</span>
                     </div>
                  </div>
                  <button className="text-[10px] font-bold text-cortex-accent tracking-[0.2em] uppercase hover:text-white transition-colors border-b border-cortex-accent/30 pb-0.5">Audit Log</button>
               </div>
            </Card>

         </div>
      </div>
   );
};
