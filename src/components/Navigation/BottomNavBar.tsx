import React from 'react';
import {
  LayoutDashboard,
  PawPrint,
  QrCode,
  Stethoscope,
  Bell
} from 'lucide-react';
import { ScreenId } from '../../types';

interface BottomNavBarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  alertCount: number;
  onScanTagClick?: () => void;
  onOpenMobileMenu?: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
  alertCount,
  onScanTagClick
}) => {
  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-surface/95 backdrop-blur-md border-t border-outline-variant/60 shadow-lg select-none pb-safe"
    >
      <div className="grid grid-cols-5 items-center max-w-lg mx-auto py-1 px-1">
        {/* Feature 1: Dashboard */}
        <button
          id="mobile-tab-dashboard"
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-colors cursor-pointer ${
            currentScreen === 'dashboard' || currentScreen === 'farmer-dashboard'
              ? 'text-primary font-bold bg-primary/10'
              : 'text-outline hover:text-on-surface'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Dashboard</span>
        </button>

        {/* Feature 2: Livestock */}
        <button
          id="mobile-tab-livestock"
          onClick={() => onNavigate('livestock')}
          className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-colors cursor-pointer ${
            currentScreen === 'livestock' || currentScreen === 'animal-detail'
              ? 'text-primary font-bold bg-primary/10'
              : 'text-outline hover:text-on-surface'
          }`}
        >
          <PawPrint className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Livestock</span>
        </button>

        {/* Center Feature: QR Scan Logo / Action */}
        <div className="flex flex-col items-center justify-center">
          <button
            id="mobile-tab-qr-scan"
            onClick={onScanTagClick}
            className="w-11 h-11 rounded-full bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer border-2 border-surface"
            aria-label="Scan Animal Ear Tag"
            title="Scan QR / Ear Tag"
          >
            <QrCode className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-bold text-primary mt-0.5 tracking-tight">Scan</span>
        </div>

        {/* Feature 3: Withdrawal */}
        <button
          id="mobile-tab-treatments"
          onClick={() => onNavigate('mrl')}
          className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-colors cursor-pointer ${
            currentScreen === 'mrl' || currentScreen === 'record-treatment'
              ? 'text-primary font-bold bg-primary/10'
              : 'text-outline hover:text-on-surface'
          }`}
        >
          <Stethoscope className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Withdrawal</span>
        </button>

        {/* Feature 4: Alerts */}
        <button
          id="mobile-tab-alerts"
          onClick={() => onNavigate('alerts')}
          className={`relative flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-colors cursor-pointer ${
            currentScreen === 'alerts'
              ? 'text-primary font-bold bg-primary/10'
              : 'text-outline hover:text-on-surface'
          }`}
        >
          <div className="relative">
            <Bell className="w-5 h-5 mb-0.5" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[15px] h-3.5 px-0.5 bg-error text-on-error rounded-full text-[9px] font-black flex items-center justify-center leading-none">
                {alertCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Alerts</span>
        </button>
      </div>
    </nav>
  );
};
