import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { RightPanel } from './RightPanel';
import { useUiStore } from '../store/uiStore';
import { CopilotChat } from '../components/CopilotChat';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { setSidebarOpen, setRightPanelOpen } = useUiStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
        setRightPanelOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen, setRightPanelOpen]);

  return (
    <div className="flex h-screen w-full bg-cortex-bg text-cortex-text overflow-hidden relative industrial-grid">
      {/* Heavy ambient glow in background */}
      <div className="absolute top-[-10%] left-1/4 w-1/2 h-[600px] bg-cortex-accent/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-1/4 w-1/3 h-[500px] bg-cortex-accent/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/4 right-[-10%] w-[300px] h-[300px] bg-cortex-danger/5 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Global scanline */}
      <div className="scanline"></div>

      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 z-10 transition-all duration-300">
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10">
          <div className="h-full z-10 animate-fade-in relative">
            {children}
          </div>
        </main>
      </div>
      <RightPanel />
      <CopilotChat />
    </div>
  );
};
