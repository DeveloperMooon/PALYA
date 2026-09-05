import React, { useState } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  QrCode,
  Globe,
  Menu,
  X,
  Sparkles,
  ShieldAlert,
  ArrowRightLeft,
  LogOut,
  UserCheck,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { ScreenId, UserRole, AuthUser } from '../../types';
import { useTheme } from '../../context/ThemeContext'; // DARK MODE: theme hook import kiya

interface TopAppBarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onScanTagClick: () => void;
  userRole: UserRole;
  onToggleRole: () => void;
  alertCount: number;
  onOpenMobileMenu: () => void;
  onReplayLaunch?: () => void;
  authUser?: AuthUser | null;
  onLogout?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentScreen,
  onNavigate,
  onScanTagClick,
  userRole,
  onToggleRole,
  alertCount,
  onOpenMobileMenu,
  onReplayLaunch,
  authUser,
  onLogout
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // DARK MODE: current mode aur switch karne wala function
  const { themeMode, setThemeMode } = useTheme();

  // DARK MODE: click karne par Light -> Dark -> System -> Light cycle
  const cycleTheme = () => {
    if (themeMode === 'light') setThemeMode('dark');
    else if (themeMode === 'dark') setThemeMode('system');
    else setThemeMode('light');
  };

  // DARK MODE: current mode ke hisaab se sahi icon
  const ThemeIcon = themeMode === 'light' ? Sun : themeMode === 'dark' ? Moon : Monitor;

  const quickJumpResults = [
    { title: 'COW-024 (UK-72819-331)', subtitle: 'Active Withdrawal - 5 Days left', screen: 'mrl' as ScreenId },
    { title: 'Betamox LA (Amoxicillin)', subtitle: 'MRL: 0.05 mg/kg - 5 days withdrawal', screen: 'mrl' as ScreenId },
    { title: 'Veterinary Case: COW-024', subtitle: 'HP-CIA Review required', screen: 'veterinary-case' as ScreenId },
    { title: 'Shiv Dairy Farm (FARM-UP-001)', subtitle: '24 Livestock - Meerut UP', screen: 'farm-management' as ScreenId }
  ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-outline-variant/50 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu + Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          id="mobile-menu-button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <div className="flex items-center bg-surface-container-low border border-outline-variant/60 rounded-full px-3.5 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <Search className="w-4 h-4 text-outline mr-2 shrink-0" />
            <input
              id="global-search-input"
              type="text"
              placeholder="Search animals (e.g. COW-024), drugs, farms..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="bg-transparent text-sm text-on-surface placeholder:text-outline w-full focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchDropdown(false);
                }}
                className="text-outline hover:text-on-surface p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Search Dropdown */}
          {showSearchDropdown && searchQuery.trim().length > 0 && (
            <div className="absolute top-full mt-1.5 left-0 w-full bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-2 z-50">
              <p className="text-[11px] font-bold text-outline px-3 py-1 uppercase tracking-wider">
                Quick Results
              </p>
              {quickJumpResults.length > 0 ? (
                quickJumpResults.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      onNavigate(res.screen);
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                    }}
                    className="p-2.5 rounded-lg hover:bg-surface-container cursor-pointer transition-colors"
                  >
                    <div className="text-xs font-bold text-primary">{res.title}</div>
                    <div className="text-[11px] text-on-surface-variant">{res.subtitle}</div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-on-surface-variant">
                  No direct matches found. Try searching COW-024, Betamox, or Mastitis.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Desktop-only secondary items */}
        {onReplayLaunch && (
          <button
            id="btn-replay-launch"
            onClick={onReplayLaunch}
            className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-outline-variant/60 text-primary hover:bg-surface-container transition-colors cursor-pointer"
            title="Replay Launch Screen Transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>Replay Intro</span>
          </button>
        )}

        <button
          id="btn-nav-landing"
          onClick={() => onNavigate(currentScreen === 'landing' ? 'dashboard' : 'landing')}
          className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-outline-variant/60 text-primary hover:bg-surface-container transition-colors"
          title="Toggle Public Marketing Landing View"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{currentScreen === 'landing' ? 'Back to App' : 'Public Landing'}</span>
        </button>

        {/* Demo Data Tag Badge (desktop only) */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs font-medium bg-secondary-fixed/50 text-secondary border border-secondary/20 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span>Demo Data Verified</span>
        </div>

        {/* Role Switcher Pill (desktop only) */}
        <button
          id="role-switch-pill"
          onClick={onToggleRole}
          className="hidden lg:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/80 text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer"
          title="Switch perspective between Farmer and Official Veterinarian"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-secondary" />
          <span className="hidden sm:inline">Role:</span>
          <span className="text-secondary uppercase">{userRole}</span>
        </button>

        {/* DARK MODE: naya toggle button, Bell icon se pehle */}
        <button
          id="theme-toggle-button"
          onClick={cycleTheme}
          title={`Theme: ${themeMode} (click to change)`}
          className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
        >
          <ThemeIcon className="w-5 h-5" />
        </button>

        {/* Notification Bell (Feature 3) */}
        <button
          id="header-alerts-bell"
          onClick={() => onNavigate('alerts')}
          className="relative p-2 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
          title="View Alerts"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {alertCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-error text-on-error rounded-full text-[10px] font-extrabold flex items-center justify-center">
              {alertCount}
            </span>
          )}
        </button>

        {/* User Profile with Dropdown Menu */}
        <div className="relative">
          <button 
            id="header-profile-avatar"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="cursor-pointer flex items-center p-0.5 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
            title="User Profile Menu"
            aria-label="User Profile Menu"
          >
            <img
              src={
                userRole === 'farmer'
                  ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEqXPLWS5Rr_DqThKUEQj0TIBtJ9Mc017HO6Q76sBD-A7XB9hwzdseBwbNRG852wkP-Vdd3_W9vzaw5GQSVqjiNJVBydiB57LVLnuZhbAyDqqbNyjSsPQYZKgIL7nATLmRqgrGuELDWCU0vImdpG1-QNuM__Q-7woLG9yTsGB2dpg1BriUYIdGXxxxbI9T7WcI24szPzk3BEdiqQwJbQ-9SMAN8Yp27TBcrfzbE2q-nNAvQUW25ocrCw'
                  : 'https://lh3.googleusercontent.com/aida-public/AB6AXuASBfynNVo7XQRn2zXdXtPkFHlMQPMymOdCbcRE-1TWh2xV7SARKeWQ_GfBjrv4sffZazeVOEHoZvdy5nuhAAyvWdolaIYZVgChxxxMfgO4vsNc5rP0ciaNRJGViBLwHcWv9260KwGJRZbbT8PlJUHhPJBMhDY7H5bQLfrtcW-7zioXYFbJ3W8eyL-QserJcgpCuTfGgFqOpbK4D9f-KRssOMZLrJeX6B93s_HNBUyxScw7qOcRw1GLzw'
              }
              alt="Profile avatar"
              className="w-8 h-8 rounded-full object-cover border border-outline-variant"
            />
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <img
                    src={
                      userRole === 'farmer'
                        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEqXPLWS5Rr_DqThKUEQj0TIBtJ9Mc017HO6Q76sBD-A7XB9hwzdseBwbNRG852wkP-Vdd3_W9vzaw5GQSVqjiNJVBydiB57LVLnuZhbAyDqqbNyjSsPQYZKgIL7nATLmRqgrGuELDWCU0vImdpG1-QNuM__Q-7woLG9yTsGB2dpg1BriUYIdGXxxxbI9T7WcI24szPzk3BEdiqQwJbQ-9SMAN8Yp27TBcrfzbE2q-nNAvQUW25ocrCw'
                        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuASBfynNVo7XQRn2zXdXtPkFHlMQPMymOdCbcRE-1TWh2xV7SARKeWQ_GfBjrv4sffZazeVOEHoZvdy5nuhAAyvWdolaIYZVgChxxxMfgO4vsNc5rP0ciaNRJGViBLwHcWv9260KwGJRZbbT8PlJUHhPJBMhDY7H5bQLfrtcW-7zioXYFbJ3W8eyL-QserJcgpCuTfGgFqOpbK4D9f-KRssOMZLrJeX6B93s_HNBUyxScw7qOcRw1GLzw'
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {authUser?.fullName || (userRole === 'farmer' ? 'Rajesh Kumar' : 'Dr. Suresh Kumar')}
                    </p>
                    <p className="text-[11px] font-semibold text-emerald-700 capitalize truncate">
                      {authUser?.role ? authUser.role.replace(/_/g, ' ') : userRole}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${authUser?.kycStatus === 'verified' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span>{authUser?.kycStatus === 'verified' ? 'KYC: Verified' : 'KYC: Pending'}</span>
                    </div>
                  </div>
                </div>

                <div className="py-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('settings');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Account Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('landing');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Public Landing
                  </button>
                </div>

                {onLogout && (
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      id="btn-header-signout"
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <span>Sign Out</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};