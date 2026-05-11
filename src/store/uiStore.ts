type Language = 'en' | 'hi' | 'te' | 'ja' | 'de';

type TranslationKey = keyof typeof translations.en;
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations } from '../i18n/translations';
export type { Language, TranslationKey } from '../i18n/translations';

export type Tab = 'dashboard' | 'processes' | 'analytics' | 'alerts' | 'builder' | 'settings';
export type AlarmTier = 'critical' | 'watch' | 'info';

export interface Alarm {
  id: string;
  message: string;
  tier: AlarmTier;
  assetId: string;
  timestamp: string;
}

export interface BuilderItem {
  id: string;
  type: 'chart' | 'kpi' | 'alarmList' | 'valve' | 'pumpCard';
  x: number;
  y: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

interface UiState {
  isSidebarOpen: boolean;
  isRightPanelOpen: boolean;
  isEmergency: boolean;
  activeTab: Tab;
  activeIncident: string | null;
  alarms: Alarm[];
  builderItems: BuilderItem[];
  focusedAssetId: string | null;
  language: Language;
  isFullscreen: boolean;
  notifications: Notification[];

  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  toggleEmergency: () => void;
  toggleFullscreen: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setRightPanelOpen: (isOpen: boolean) => void;
  setEmergency: (isEmergency: boolean) => void;
  setActiveTab: (tab: Tab) => void;
  addAlarm: (alarm: Alarm) => void;
  removeAlarm: (id: string) => void;
  clearAlarms: () => void;
  addBuilderItem: (item: BuilderItem) => void;
  updateBuilderItem: (id: string, coords: { x: number; y: number }) => void;
  removeBuilderItem: (id: string) => void;
  setFocusedAssetId: (id: string | null) => void;
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  setLanguage: (lang: Language) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  t: (key: TranslationKey) => string;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      isSidebarOpen: true,
      isRightPanelOpen: false,
      isEmergency: false,
      activeTab: 'dashboard',
      activeIncident: null,
      alarms: [
        { id: '1', message: 'Cooling Pump pressure high', tier: 'watch', assetId: 'pump', timestamp: new Date().toISOString() },
        { id: '2', message: 'Main Boiler temperature rising', tier: 'info', assetId: 'boiler', timestamp: new Date().toISOString() },
      ],
      builderItems: [],
      focusedAssetId: null,
      copilotOpen: false,
      language: 'en',
      isFullscreen: false,
      notifications: [
        { id: 'n1', title: 'System Update', message: 'CortexAI Core upgraded to v4.2.1', type: 'info', timestamp: new Date().toISOString(), read: false },
        { id: 'n2', title: 'Maintenance Due', message: 'Pump A2 seal inspection required within 24h', type: 'warning', timestamp: new Date().toISOString(), read: false },
        { id: 'n3', title: 'Security Alert', message: 'New terminal access detected from Sector 7', type: 'info', timestamp: new Date().toISOString(), read: true },
      ],

      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      toggleRightPanel: () => set((state) => ({ isRightPanelOpen: !state.isRightPanelOpen })),
      toggleEmergency: () => set((state) => {
        const newEmergency = !state.isEmergency;
        const emergencyAlarms: Alarm[] = newEmergency ? [
          { id: 'err-1', message: 'Cooling Pump SEAL FAILURE', tier: 'critical', assetId: 'pump', timestamp: new Date().toISOString() },
          { id: 'err-2', message: 'Pressure Vessel SPIKE detected', tier: 'critical', assetId: 'vessel', timestamp: new Date().toISOString() },
        ] : [];

        return {
          isEmergency: newEmergency,
          activeIncident: newEmergency ? 'Cooling Pump failure detected' : null,
          isRightPanelOpen: newEmergency ? true : state.isRightPanelOpen,
          activeTab: newEmergency ? 'dashboard' : state.activeTab,
          alarms: newEmergency ? [...state.alarms, ...emergencyAlarms] : state.alarms.filter(a => !a.id.startsWith('err-')),
          focusedAssetId: newEmergency ? 'pump' : state.focusedAssetId,
          copilotOpen: newEmergency ? true : state.copilotOpen
        };
      }),
      toggleFullscreen: () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
          set({ isFullscreen: true });
        } else {
          document.exitFullscreen();
          set({ isFullscreen: false });
        }
      },
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      setRightPanelOpen: (isOpen) => set({ isRightPanelOpen: isOpen }),
      setEmergency: (isEmergency) => set({
        isEmergency,
        activeIncident: isEmergency ? 'Cooling Pump failure detected' : null,
        isRightPanelOpen: isEmergency ? true : false,
        focusedAssetId: isEmergency ? 'pump' : null,
        copilotOpen: isEmergency ? true : false
      }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      addAlarm: (alarm) => set((state) => ({ alarms: [alarm, ...state.alarms] })),
      removeAlarm: (id) => set((state) => ({ alarms: state.alarms.filter(a => a.id !== id) })),
      clearAlarms: () => set({ alarms: [] }),
      addBuilderItem: (item) => set((state) => ({ builderItems: [...state.builderItems, item] })),
      updateBuilderItem: (id, coords) => set((state) => ({
        builderItems: state.builderItems.map(item =>
          item.id === id ? { ...item, x: coords.x, y: coords.y } : item
        )
      })),
      removeBuilderItem: (id) => set((state) => ({
        builderItems: state.builderItems.filter(item => item.id !== id)
      })),
      setFocusedAssetId: (id) => set({ focusedAssetId: id }),
      setCopilotOpen: (open) => set({ copilotOpen: open }),
      setLanguage: (lang) => set({ language: lang }),
      markNotificationAsRead: (id) => set(state => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      clearNotifications: () => set({ notifications: [] }),
      t: (key) => {
        const lang = get().language;
        return (
          translations[lang as keyof typeof translations]?.[
          key as keyof typeof translations.en
          ] ||
          translations.en[key as keyof typeof translations.en] ||
          key
        );
      },
    }),
    {
      name: 'cortexops-ui-storage',
      partialize: (state) => ({ language: state.language, isFullscreen: state.isFullscreen }),
    }
  )
);


