import { useState, useRef } from 'react';
import { useUiStore } from '../store/uiStore';
import type { BuilderItem } from '../store/uiStore';
import { LayoutDashboard, GripVertical, Settings2, Component, Trash2, Save, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


export function BuilderMode() {
  const { builderItems, addBuilderItem, updateBuilderItem, removeBuilderItem, setActiveTab, t } = useUiStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedType, setDraggedType] = useState<BuilderItem['type'] | null>(null);

  const handleDragStart = (e: React.DragEvent, type: BuilderItem['type']) => {
    setDraggedType(type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    addBuilderItem({
      id: `item-${Date.now()}`,
      type: draggedType,
      x: x - 50,
      y: y - 50
    });
    setDraggedType(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleItemDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('itemId', id);
  };

  const handleItemDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('itemId');
    if (id && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      updateBuilderItem(id, { x: x - 50, y: y - 50 });
    }
  };

  return (
    <div className="flex-1 flex bg-cortex-bg h-full overflow-hidden animate-fade-in">
      {/* Palette */}
      <div className="w-72 border-r border-white/5 glass-panel p-6 flex flex-col z-20">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cortex-text-muted mb-6">
          {t('hmiToolset')}
        </div>
        
        <div className="space-y-3 mb-8">
          <DraggableComponent type="kpi" label={t('kpiTile')} icon={<Settings2 size={16}/>} onDragStart={handleDragStart} />
          <DraggableComponent type="chart" label={t('trendChart')} icon={<LayoutDashboard size={16}/>} onDragStart={handleDragStart} />
          <DraggableComponent type="alarmList" label={t('alarmListLabel')} icon={<Settings2 size={16}/>} onDragStart={handleDragStart} />
          <DraggableComponent type="valve" label={t('valveControl')} icon={<Component size={16}/>} onDragStart={handleDragStart} />
          <DraggableComponent type="pumpCard" label={t('pumpCardLabel')} icon={<LayoutDashboard size={16}/>} onDragStart={handleDragStart} />
        </div>

        <div className="bg-black/20 rounded-xl p-4 border border-white/5 mt-auto">
          <div className="text-[10px] text-cortex-text-muted mb-3 uppercase tracking-widest font-bold">{t('canvasStats')}</div>
          <div className="flex justify-between text-sm text-white mb-1">
            <span>{t('elements')}</span>
            <span className="font-mono text-cortex-accent">{builderItems.length}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('dashboard')}
            className="w-full bg-cortex-accent text-black font-bold py-3 rounded-xl hover:bg-white transition-all duration-300 shadow-[0_0_15px_var(--color-cortex-accent-glow)] flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {t('publishHmi')}
          </motion.button>
        </div>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        onDrop={(e) => { handleDrop(e); handleItemDrop(e); }}
        onDragOver={handleDragOver}
        className="flex-1 relative bg-[radial-gradient(var(--color-white)_0.5px,transparent_0.5px)] [background-size:30px_30px] opacity-[0.03] absolute inset-0 pointer-events-none"
      ></div>
      <div 
        className="flex-1 relative overflow-auto p-12"
        onDrop={(e) => { handleDrop(e); handleItemDrop(e); }}
        onDragOver={handleDragOver}
      >
        <div className="absolute top-12 left-12 text-white/5 font-mono text-8xl font-bold uppercase pointer-events-none select-none z-0 tracking-tighter">
          {t('sandbox')}
        </div>
        
        <AnimatePresence>
          {builderItems.map(item => (
            <motion.div
              key={item.id}
              layoutId={item.id}
              draggable
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onDragStart={(e: any) => handleItemDragStart(e, item.id)}
              className="absolute cursor-move z-10 group"
              style={{ left: item.x, top: item.y }}
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={14} className="text-cortex-text-muted" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">{item.type}</span>
                <button 
                  onClick={() => removeBuilderItem(item.id)}
                  className="p-1 hover:bg-cortex-danger/20 rounded-md text-cortex-danger transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="ring-2 ring-transparent group-hover:ring-cortex-accent/50 rounded-xl transition-all">
                <RenderItem type={item.type} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DraggableComponent({ type, label, icon, onDragStart }: { type: BuilderItem['type'], label: string, icon: React.ReactNode, onDragStart: (e: React.DragEvent, type: BuilderItem['type']) => void }) {
  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      className="glass-panel-interactive border border-white/5 p-4 rounded-xl flex items-center gap-4 cursor-grab hover:border-cortex-accent/30 transition-all group"
    >
      <div className="text-cortex-accent group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-sm font-medium text-cortex-text-muted group-hover:text-white transition-colors">{label}</span>
      <MousePointer2 className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity" size={14} />
    </div>
  );
}

function RenderItem({ type }: { type: BuilderItem['type'] }) {
  switch (type) {
    case 'kpi':
      return (
        <div className="glass-panel w-56 p-5 rounded-xl border border-white/10 shadow-2xl">
          <div className="text-[10px] text-cortex-text-muted uppercase tracking-[0.2em] font-bold mb-2">Pressure KPI</div>
          <div className="text-3xl font-light text-white tracking-tight flex items-baseline gap-1">
            14.2 <span className="text-sm text-cortex-text-muted font-medium uppercase">bar</span>
          </div>
        </div>
      );
    case 'chart':
      return (
        <div className="glass-panel w-72 h-40 p-5 rounded-xl border border-white/10 shadow-2xl flex flex-col">
          <div className="text-[10px] text-cortex-text-muted uppercase tracking-[0.2em] font-bold mb-4">Temperature Trend</div>
          <div className="flex-1 border-b border-l border-white/10 flex items-end p-2 gap-1.5">
            {[40, 65, 45, 85, 55, 95, 75].map((h, i) => (
              <motion.div 
                key={i} 
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className="flex-1 bg-cortex-accent/40 rounded-t-sm hover:bg-cortex-accent transition-colors" 
              />
            ))}
          </div>
        </div>
      );
    case 'alarmList':
      return (
        <div className="glass-panel w-72 p-5 rounded-xl border border-white/10 shadow-2xl">
          <div className="text-[10px] text-cortex-text-muted uppercase tracking-[0.2em] font-bold mb-4">Live Alerts</div>
          <div className="space-y-3">
            <div className="h-8 bg-black/40 rounded-lg border border-white/5" />
            <div className="h-8 bg-cortex-danger/10 rounded-lg border border-cortex-danger/30" />
            <div className="h-8 bg-black/40 rounded-lg border border-white/5" />
          </div>
        </div>
      );
    case 'valve':
      return (
        <div className="glass-panel w-40 p-6 rounded-xl border border-white/10 shadow-2xl flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-2 border-cortex-success flex items-center justify-center mb-4 relative">
             <div className="absolute inset-0 rounded-full border-4 border-cortex-success/20 animate-ping"></div>
             <div className="text-xs font-bold text-cortex-success neon-text">OPEN</div>
          </div>
          <p className="text-[10px] text-cortex-text-muted uppercase tracking-widest font-bold">Valve V-102</p>
        </div>
      );
    case 'pumpCard':
      return (
        <div className="glass-panel w-64 p-5 rounded-xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-white tracking-wide">Pump System A</p>
            <div className="w-2.5 h-2.5 rounded-full bg-cortex-success shadow-[0_0_10px_var(--color-cortex-success)] animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                <div className="text-[9px] text-cortex-text-muted uppercase mb-1">RPM</div>
                <div className="text-sm font-mono text-white">1450</div>
             </div>
             <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                <div className="text-[9px] text-cortex-text-muted uppercase mb-1">TEMP</div>
                <div className="text-sm font-mono text-white">42.4°C</div>
             </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}
