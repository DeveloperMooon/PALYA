import React from 'react';

import {
  LayoutDashboard,
  Tractor,
  PawPrint,
  HeartPulse,
  Stethoscope,
  Timer,
  BarChart3,
  ShieldCheck,
  Bell,
  ClipboardCheck,
  TrendingUp,
  FileText,
  Bot,
  Settings,
  QrCode,
  UserCheck,
  LogOut,
  X
} from 'lucide-react';

import {
  ScreenId,
  UserRole,
  AuthUser,
  AppRole
} from '../../types';


interface SideNavBarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onScanTagClick: () => void;
  userRole: UserRole;
  onToggleRole: () => void;
  alertCount: number;
  authUser?: AuthUser | null;
  isAdminMode?: boolean;
  onLogout?: () => void;
  isMobileDrawer?: boolean;
  onClose?: () => void;
}


const getRoleLabel = (
  role?: AppRole
): string => {
  switch (role) {
    case 'livestock_owner':
      return 'Livestock Owner';

    case 'veterinarian':
      return 'Veterinarian';

    case 'laboratory':
      return 'Laboratory';

    case 'government_official':
      return 'Government Official';

    case 'collector':
      return 'Collector';

    case 'pharmaceutical_retailer':
      return 'Pharmaceutical Retailer';

    default:
      return 'User';
  }
};


const getHomeScreenForRole = (
  role?: AppRole
): ScreenId => {
  switch (role) {
    case 'veterinarian':
      return 'veterinary-review';

    case 'laboratory':
      return 'lab-result';

    case 'government_official':
      return 'reports';

    case 'collector':
      return 'livestock';

    case 'pharmaceutical_retailer':
      return 'amu';

    case 'livestock_owner':
    default:
      return 'dashboard';
  }
};


export const SideNavBar: React.FC<
  SideNavBarProps
> = ({
  currentScreen,
  onNavigate,
  onScanTagClick,
  userRole,
  alertCount,
  authUser,
  isAdminMode = false,
  onLogout,
  isMobileDrawer = false,
  onClose
}) => {

  const navItems: {
    id: ScreenId;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
    roles?: AppRole[];
  }[] = [

    {
      id: 'dashboard',
      label: 'Dashboard',
      icon:
        <LayoutDashboard className="w-5 h-5" />,
      roles: [
        'livestock_owner'
      ]
    },

    {
      id: 'farm-management',
      label: 'Farm Management',
      icon:
        <Tractor className="w-5 h-5" />,
      roles: [
        'livestock_owner'
      ]
    },

    {
      id: 'livestock',
      label: 'Livestock',
      icon:
        <PawPrint className="w-5 h-5" />,
      roles: [
        'livestock_owner',
        'collector',
        'veterinarian',
        'government_official'
      ]
    },

    {
      id: 'early-detection',
      label: 'Early Detection',
      icon:
        <HeartPulse className="w-5 h-5" />,
      roles: [
        'livestock_owner',
        'veterinarian'
      ]
    },

    {
      id: 'record-treatment',
      label: 'Treatments',
      icon:
        <Stethoscope className="w-5 h-5" />,
      roles: [
        'livestock_owner',
        'veterinarian'
      ]
    },

    {
      id: 'mrl',
      label: 'MRL & Withdrawal',
      icon:
        <Timer className="w-5 h-5" />,
      roles: [
        'livestock_owner',
        'veterinarian',
        'laboratory'
      ]
    },

    {
      id: 'amu',
      label: 'AMU Dashboard',
      icon:
        <BarChart3 className="w-5 h-5" />,
      roles: [
        'livestock_owner',
        'veterinarian',
        'government_official',
        'pharmaceutical_retailer'
      ]
    },

    {
      id: 'stewardship',
      label: 'Stewardship Score',
      icon:
        <ShieldCheck className="w-5 h-5" />,
      roles: [
        'livestock_owner',
        'veterinarian',
        'government_official'
      ]
    },

    {
      id: 'alerts',
      label: 'Alerts',
      icon:
        <Bell className="w-5 h-5" />,
      badge:
        alertCount > 0
          ? alertCount
          : undefined,
      badgeColor:
        'bg-error text-on-error',
      roles: [
        'livestock_owner',
        'veterinarian',
        'government_official',
        'collector'
      ]
    },

    {
      id: 'veterinary-review',
      label: 'Veterinary Review',
      icon:
        <ClipboardCheck className="w-5 h-5" />,
      badge:
        authUser?.role ===
        'veterinarian'
          ? '5 req'
          : undefined,
      badgeColor:
        'bg-primary-container text-on-primary-container',
      roles: [
        'veterinarian'
      ]
    },

    {
      id: 'lab-result',
      label: 'Lab Results',
      icon:
        <ClipboardCheck className="w-5 h-5" />,
      roles: [
        'laboratory',
        'veterinarian'
      ]
    },

    {
      id: 'analytics',
      label: 'Analytics',
      icon:
        <TrendingUp className="w-5 h-5" />,
      roles: [
        'livestock_owner',
        'veterinarian',
        'government_official'
      ]
    },

    {
      id: 'reports',
      label: 'Reports',
      icon:
        <FileText className="w-5 h-5" />,
      roles: [
        'government_official',
        'veterinarian'
      ]
    },

    {
      id: 'ai-assistant',
      label: 'AI Assistant',
      icon:
        <Bot className="w-5 h-5" />,
      roles: [
        'livestock_owner',
        'veterinarian',
        'laboratory',
        'government_official',
        'collector',
        'pharmaceutical_retailer'
      ]
    },

    {
      id: 'settings',
      label: 'Settings',
      icon:
        <Settings className="w-5 h-5" />,
      roles: [
        'livestock_owner',
        'veterinarian',
        'laboratory',
        'government_official',
        'collector',
        'pharmaceutical_retailer'
      ]
    }
  ];


  const visibleNavItems =
  isAdminMode
    ? navItems
    : navItems.filter((item) => {

        if (!authUser?.role) {
          return true;
        }

        if (!item.roles) {
          return true;
        }

        return item.roles.includes(
          authUser.role
        );
      });


  const handleItemClick = (
    screenId: ScreenId
  ) => {

    onNavigate(
      screenId
    );

    if (onClose) {
      onClose();
    }
  };


  const handleScanClick = () => {

    onScanTagClick();

    if (onClose) {
      onClose();
    }
  };


  const handleLogoClick = () => {

    handleItemClick(
      getHomeScreenForRole(
        authUser?.role
      )
    );
  };


  const roleLabel =
    getRoleLabel(
      authUser?.role
    );


  const userName =
    authUser?.fullName ||
    'PALYA User';


  const content = (
    <>

      {/* Brand Header */}

      <div className="flex items-center justify-between mb-6 px-1">

        <div
          onClick={
            handleLogoClick
          }
          className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
        >

          <div className="w-11 h-11 rounded-xl bg-white border border-outline-variant/40 p-1 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">

            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBalydRg2eY901DQK2BcFn0HHpPgj8oC_5_PwT4aicpLUc9fWMGzxQC1hlsTalrf3WDIr_KTdjwRrwHhq4bWUwc9TkkAR4BXck3D5lBKgU_aDdkHiLcZ3pBdWQ9TwFBGJ3u0VUBpynag1XIcOROJjPXrzhdffA3XPuDihVLnBlh9NHNTMWRKpq2Cf2zJ9jUcccRHbF6_vj1zEf8f9bV-vtEdPINyErirs4wpgY6II3UIKTjQVt2fHRiRg"
              alt="PALYA Logo"
              className="w-full h-full object-contain"
            />

          </div>


          <div className="truncate">

            <div className="text-xl font-extrabold text-primary leading-tight flex items-center gap-1.5">
              PALYA
            </div>

            <p className="text-[12px] font-semibold text-on-surface-variant tracking-wide truncate">
              Health Stewardship
            </p>

          </div>

        </div>


        {isMobileDrawer &&
          onClose && (

          <button
            id="mobile-drawer-close-btn"
            onClick={
              onClose
            }
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Close navigation menu"
          >

            <X className="w-5 h-5" />

          </button>
        )}

      </div>


      {/* Scan Tag */}

      <button
        id={
          isMobileDrawer
            ? 'mobile-drawer-scan-tag-btn'
            : 'sidebar-scan-tag-btn'
        }
        onClick={
          handleScanClick
        }
        className="w-full bg-primary hover:bg-primary-container active:scale-[0.98] transition-all text-on-primary rounded-lg py-3 px-4 flex items-center justify-center gap-2 mb-6 min-h-[48px] shadow-sm font-semibold text-sm cursor-pointer shrink-0"
      >

        <QrCode className="w-5 h-5 text-secondary-fixed" />

        <span>
          Scan Tag
        </span>

      </button>


      {/* Navigation */}

      <nav className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">

        {visibleNavItems.map(
          (item) => {

            const isActive =
              currentScreen ===
                item.id ||
              (
                item.id ===
                  'veterinary-review' &&
                currentScreen ===
                  'veterinary-case'
              );


            return (

              <button
                key={
                  item.id
                }
                id={`${
                  isMobileDrawer
                    ? 'mobile-nav-'
                    : 'nav-'
                }${item.id}`}
                onClick={() =>
                  handleItemClick(
                    item.id
                  )
                }
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-primary font-medium'
                }`}
              >

                <div className="flex items-center gap-3 truncate">

                  <span
                    className={
                      isActive
                        ? 'text-on-secondary-container'
                        : 'text-on-surface-variant'
                    }
                  >
                    {item.icon}
                  </span>

                  <span className="truncate">
                    {item.label}
                  </span>

                </div>


                {item.badge && (

                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      item.badgeColor ||
                      'bg-surface-variant text-on-surface-variant'
                    }`}
                  >

                    {item.badge}

                  </span>

                )}

              </button>
            );
          }
        )}

      </nav>


      {/* User Profile */}

      <div className="pt-4 mt-2 border-t border-outline-variant/60 shrink-0">

        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-surface-container-low">

          <div className="flex-1 flex items-center gap-2.5 min-w-0 p-1 rounded-lg">

            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center border border-outline-variant shrink-0">

              <UserCheck className="w-4 h-4 text-primary" />

            </div>


            <div className="flex-1 min-w-0">

              <p className="text-xs font-bold text-on-surface truncate">

                {userName}

              </p>


              <div className="flex items-center gap-1 text-[10px] text-secondary font-semibold truncate">

                <UserCheck className="w-3 h-3 text-secondary shrink-0" />

                <span className="truncate">

                  {roleLabel}

                </span>

              </div>

            </div>

          </div>


          {onLogout && (

            <button
              type="button"
              onClick={
                onLogout
              }
              className="p-2 text-on-surface-variant hover:text-error hover:bg-surface-container-highest rounded-lg transition-colors cursor-pointer shrink-0"
              title="Sign Out"
              aria-label="Sign Out"
            >

              <LogOut className="w-4 h-4" />

            </button>

          )}

        </div>

      </div>

    </>
  );


  if (isMobileDrawer) {

    return (

      <div className="fixed inset-0 z-50 bg-black/60 lg:hidden flex animate-in fade-in duration-200">

        <aside className="w-72 sm:w-80 max-w-[85vw] bg-surface-container h-full flex flex-col p-4 z-50 select-none shadow-2xl animate-in slide-in-from-left duration-200 border-r border-outline-variant">

          {content}

        </aside>


        <div
          className="flex-1 cursor-pointer"
          onClick={
            onClose
          }
          aria-label="Close menu backdrop"
        />

      </div>
    );
  }


  return (

    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-surface-container border-r border-outline-variant flex-col p-4 z-40 select-none">

      {content}

    </aside>
  );
};