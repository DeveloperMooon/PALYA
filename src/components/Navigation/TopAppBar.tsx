import React, { useState } from 'react';

import {
  Search,
  Bell,
  Globe,
  Menu,
  X,
  Sparkles,
  LogOut,
  UserCheck,
  Sun,
  Moon,
  Monitor,
  ChevronDown
} from 'lucide-react';

import {
  ScreenId,
  UserRole,
  AuthUser,
  AppRole
} from '../../types';

import {
  useTheme
} from '../../context/ThemeContext';


interface TopAppBarProps {
  currentScreen: ScreenId;

  onNavigate: (
    screen: ScreenId
  ) => void;

  onScanTagClick: () => void;

  userRole: UserRole;

  onToggleRole: () => void;

  alertCount: number;

  onOpenMobileMenu: () => void;

  onReplayLaunch?: () => void;

  authUser?: AuthUser | null;

  onLogout?: () => void;

  onSelectRole?: (
    role: AppRole
  ) => void;
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

    case 'admin':
      return 'Administrator';

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

    case 'admin':
      return 'dashboard';

    case 'livestock_owner':
    default:
      return 'dashboard';
  }
};


const getInitials = (
  name?: string
): string => {

  if (!name) {
    return 'U';
  }

  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part
          .charAt(0)
          .toUpperCase()
    )
    .join('');
};


const ADMIN_ROLE_OPTIONS: {
  value: AppRole;
  label: string;
  description: string;
}[] = [

  {
    value:
      'livestock_owner',

    label:
      'Livestock Owner',

    description:
      'Farm & livestock management'
  },

  {
    value:
      'veterinarian',

    label:
      'Veterinarian',

    description:
      'Veterinary review & cases'
  },

  {
    value:
      'laboratory',

    label:
      'Laboratory',

    description:
      'Laboratory results & diagnostics'
  },

  {
    value:
      'government_official',

    label:
      'Government Official',

    description:
      'Reports & regulatory monitoring'
  },

  {
    value:
      'collector',

    label:
      'Collector',

    description:
      'Livestock & field operations'
  },

  {
    value:
      'pharmaceutical_retailer',

    label:
      'Pharmaceutical Retailer',

    description:
      'AMU & medicine monitoring'
  }

];


export const TopAppBar:
React.FC<TopAppBarProps> = ({

  currentScreen,

  onNavigate,

  alertCount,

  onOpenMobileMenu,

  onReplayLaunch,

  authUser,

  onLogout,

  onSelectRole

}) => {


  const [
    searchQuery,
    setSearchQuery
  ] = useState('');


  const [
    showSearchDropdown,
    setShowSearchDropdown
  ] = useState(false);


  const [
    showProfileMenu,
    setShowProfileMenu
  ] = useState(false);


  const [
    showRoleMenu,
    setShowRoleMenu
  ] = useState(false);


  const {
    themeMode,
    setThemeMode
  } = useTheme();


  const isAdmin =
    authUser?.role ===
    'admin';


  const userName =
    authUser?.fullName ||
    'PALYA User';


  const roleLabel =
    getRoleLabel(
      authUser?.role
    );


  const initials =
    getInitials(
      authUser?.fullName
    );


  const homeScreen =
    getHomeScreenForRole(
      authUser?.role
    );


  const cycleTheme =
    () => {

      if (
        themeMode ===
        'light'
      ) {

        setThemeMode(
          'dark'
        );

      } else if (
        themeMode ===
        'dark'
      ) {

        setThemeMode(
          'system'
        );

      } else {

        setThemeMode(
          'light'
        );

      }
    };


  const ThemeIcon =
    themeMode ===
    'light'
      ? Sun
      : themeMode ===
        'dark'
        ? Moon
        : Monitor;


  const quickJumpResults = [

    {
      title:
        'COW-024 (UK-72819-331)',

      subtitle:
        'Active Withdrawal - 5 Days left',

      screen:
        'mrl' as ScreenId
    },

    {
      title:
        'Betamox LA (Amoxicillin)',

      subtitle:
        'MRL: 0.05 mg/kg - 5 days withdrawal',

      screen:
        'mrl' as ScreenId
    },

    {
      title:
        'Veterinary Case: COW-024',

      subtitle:
        'HP-CIA Review required',

      screen:
        'veterinary-case' as ScreenId
    },

    {
      title:
        'Shiv Dairy Farm (FARM-UP-001)',

      subtitle:
        '24 Livestock - Meerut UP',

      screen:
        'farm-management' as ScreenId
    }

  ].filter(
    (item) =>

      item.title
        .toLowerCase()
        .includes(
          searchQuery
            .toLowerCase()
        )

      ||

      item.subtitle
        .toLowerCase()
        .includes(
          searchQuery
            .toLowerCase()
        )
  );


  return (

    <header
      className="
        sticky
        top-0
        z-30
        bg-surface/90
        backdrop-blur-md
        border-b
        border-outline-variant/50
        px-4
        lg:px-8
        py-3
        flex
        items-center
        justify-between
        gap-4
      "
    >


      {/* =====================================================
          LEFT
      ===================================================== */}

      <div
        className="
          flex
          items-center
          gap-3
          flex-1
          max-w-xl
        "
      >


        {/* MOBILE MENU */}

        <button
          id="mobile-menu-button"

          type="button"

          onClick={
            onOpenMobileMenu
          }

          className="
            lg:hidden
            p-2
            rounded-lg
            text-on-surface-variant
            hover:bg-surface-container
            cursor-pointer
          "

          aria-label="
            Open navigation menu
          "
        >

          <Menu
            className="
              w-6
              h-6
            "
          />

        </button>


        {/* =====================================================
            SEARCH
        ===================================================== */}

        <div
          className="
            relative
            w-full
          "
        >

          <div
            className="
              flex
              items-center
              bg-surface-container-low
              border
              border-outline-variant/60
              rounded-full
              px-3.5
              py-1.5
              focus-within:border-primary
              focus-within:ring-2
              focus-within:ring-primary/10
              transition-all
            "
          >

            <Search
              className="
                w-4
                h-4
                text-outline
                mr-2
                shrink-0
              "
            />


            <input
              id="
                global-search-input
              "

              type="text"

              placeholder="
                Search animals, drugs, farms...
              "

              value={
                searchQuery
              }

              onChange={(
                event
              ) => {

                setSearchQuery(
                  event.target.value
                );

                setShowSearchDropdown(
                  true
                );

              }}

              onFocus={() =>
                setShowSearchDropdown(
                  true
                )
              }

              className="
                bg-transparent
                text-sm
                text-on-surface
                placeholder:text-outline
                w-full
                focus:outline-none
              "
            />


            {searchQuery && (

              <button
                type="button"

                onClick={() => {

                  setSearchQuery(
                    ''
                  );

                  setShowSearchDropdown(
                    false
                  );

                }}

                className="
                  text-outline
                  hover:text-on-surface
                  p-0.5
                  cursor-pointer
                "

                aria-label="
                  Clear search
                "
              >

                <X
                  className="
                    w-3.5
                    h-3.5
                  "
                />

              </button>

            )}

          </div>


          {/* SEARCH RESULTS */}

          {showSearchDropdown &&
            searchQuery
              .trim()
              .length >
              0 && (

            <div
              className="
                absolute
                top-full
                mt-1.5
                left-0
                w-full
                bg-surface-container-lowest
                border
                border-outline-variant
                rounded-xl
                shadow-lg
                p-2
                z-50
              "
            >

              <p
                className="
                  text-[11px]
                  font-bold
                  text-outline
                  px-3
                  py-1
                  uppercase
                  tracking-wider
                "
              >
                Quick Results
              </p>


              {quickJumpResults.length >
              0 ? (

                quickJumpResults.map(
                  (
                    result,
                    index
                  ) => (

                  <button
                    type="button"

                    key={
                      index
                    }

                    onClick={() => {

                      onNavigate(
                        result.screen
                      );

                      setShowSearchDropdown(
                        false
                      );

                      setSearchQuery(
                        ''
                      );

                    }}

                    className="
                      w-full
                      text-left
                      p-2.5
                      rounded-lg
                      hover:bg-surface-container
                      cursor-pointer
                      transition-colors
                    "
                  >

                    <div
                      className="
                        text-xs
                        font-bold
                        text-primary
                      "
                    >
                      {result.title}
                    </div>


                    <div
                      className="
                        text-[11px]
                        text-on-surface-variant
                      "
                    >
                      {result.subtitle}
                    </div>

                  </button>

                ))

              ) : (

                <div
                  className="
                    p-3
                    text-center
                    text-xs
                    text-on-surface-variant
                  "
                >
                  No direct matches found.
                </div>

              )}

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <div
        className="
          flex
          items-center
          gap-1.5
          sm:gap-3
          shrink-0
        "
      >


        {/* REPLAY */}

        {onReplayLaunch && (

          <button
            id="
              btn-replay-launch
            "

            type="button"

            onClick={
              onReplayLaunch
            }

            className="
              hidden
              lg:flex
              items-center
              gap-1.5
              text-xs
              font-semibold
              px-3
              py-1.5
              rounded-full
              border
              border-outline-variant/60
              text-primary
              hover:bg-surface-container
              transition-colors
              cursor-pointer
            "

            title="
              Replay Intro
            "
          >

            <Sparkles
              className="
                w-3.5
                h-3.5
                text-secondary
              "
            />

            <span>
              Replay Intro
            </span>

          </button>

        )}


        {/* PUBLIC LANDING */}

        <button
          id="
            btn-nav-landing
          "

          type="button"

          onClick={() => {

            if (
              currentScreen ===
              'landing'
            ) {

              onNavigate(
                homeScreen
              );

            } else {

              onNavigate(
                'landing'
              );

            }

          }}

          className="
            hidden
            lg:flex
            items-center
            gap-1.5
            text-xs
            font-semibold
            px-3
            py-1.5
            rounded-full
            border
            border-outline-variant/60
            text-primary
            hover:bg-surface-container
            transition-colors
            cursor-pointer
          "

          title="
            Public Landing
          "
        >

          <Globe
            className="
              w-3.5
              h-3.5
            "
          />

          <span>

            {currentScreen ===
            'landing'
              ? 'Back to App'
              : 'Public Landing'}

          </span>

        </button>


        {/* =====================================================
            ADMIN ROLE SWITCHER

            ONLY ADMIN GETS THIS DROPDOWN
        ===================================================== */}

        {isAdmin &&
        onSelectRole ? (

          <div
            className="
              relative
              hidden
              lg:block
            "
          >

            <button
              type="button"

              id="
                admin-role-switcher
              "

              onClick={() => {

                setShowRoleMenu(
                  !showRoleMenu
                );

                setShowProfileMenu(
                  false
                );

              }}

              className="
                flex
                items-center
                gap-1.5
                text-xs
                font-bold
                px-3
                py-1.5
                rounded-full
                bg-primary-container
                border
                border-primary/30
                text-primary
                hover:bg-primary-fixed
                transition-colors
                cursor-pointer
              "

              title="
                Administrator Role Gateway
              "
            >

              <UserCheck
                className="
                  w-3.5
                  h-3.5
                "
              />

              <span>
                Administrator
              </span>

              <ChevronDown
                className="
                  w-3.5
                  h-3.5
                "
              />

            </button>


            {showRoleMenu && (

              <>

                <div
                  className="
                    fixed
                    inset-0
                    z-40
                  "

                  onClick={() =>
                    setShowRoleMenu(
                      false
                    )
                  }
                />


                <div
                  className="
                    absolute
                    right-0
                    mt-2
                    w-72
                    bg-surface-container-lowest
                    border
                    border-outline-variant
                    rounded-2xl
                    shadow-xl
                    p-2
                    z-50
                  "
                >

                  <div
                    className="
                      px-3
                      pt-2
                      pb-2
                      border-b
                      border-outline-variant/50
                      mb-1
                    "
                  >

                    <p
                      className="
                        text-[10px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-primary
                      "
                    >
                      Admin Gateway
                    </p>

                    <p
                      className="
                        text-[11px]
                        text-on-surface-variant
                        mt-0.5
                      "
                    >
                      Select a role interface
                      to access
                    </p>

                  </div>


                  {ADMIN_ROLE_OPTIONS.map(
                    (
                      option
                    ) => (

                    <button
                      key={
                        option.value
                      }

                      type="button"

                      onClick={() => {

                        onSelectRole(
                          option.value
                        );

                        setShowRoleMenu(
                          false
                        );

                      }}

                      className="
                        w-full
                        text-left
                        px-3
                        py-2.5
                        rounded-xl
                        hover:bg-surface-container
                        transition-colors
                        cursor-pointer
                      "
                    >

                      <div
                        className="
                          text-xs
                          font-bold
                          text-on-surface
                        "
                      >
                        {option.label}
                      </div>

                      <div
                        className="
                          text-[10px]
                          text-on-surface-variant
                          mt-0.5
                        "
                      >
                        {option.description}
                      </div>

                    </button>

                  ))}

                </div>

              </>

            )}

          </div>

        ) : (

          /* ===================================================
             NORMAL USER

             DISPLAY ONLY.
             NO DROPDOWN.
             NO ROLE SWITCHING.
          =================================================== */

          <div
            className="
              hidden
              lg:flex
              items-center
              gap-1.5
              text-xs
              font-bold
              px-3
              py-1.5
              rounded-full
              bg-surface-container-high
              border
              border-outline-variant/80
              text-on-surface
            "
          >

            <UserCheck
              className="
                w-3.5
                h-3.5
                text-secondary
              "
            />

            <span
              className="
                text-secondary
              "
            >
              {roleLabel}
            </span>

          </div>

        )}


        {/* DEMO DATA */}

        <div
          className="
            hidden
            xl:flex
            items-center
            gap-1.5
            text-xs
            font-medium
            bg-secondary-fixed/50
            text-secondary
            border
            border-secondary/20
            px-3
            py-1
            rounded-full
          "
        >

          <span
            className="
              w-2
              h-2
              rounded-full
              bg-secondary
              animate-pulse
            "
          />

          <span>
            Demo Data Verified
          </span>

        </div>


        {/* THEME */}

        <button
          id="
            theme-toggle-button
          "

          type="button"

          onClick={
            cycleTheme
          }

          title={
            `Theme: ${themeMode}`
          }

          className="
            p-2
            rounded-full
            text-on-surface-variant
            hover:bg-surface-container
            hover:text-primary
            transition-colors
            cursor-pointer
          "
        >

          <ThemeIcon
            className="
              w-5
              h-5
            "
          />

        </button>


        {/* NOTIFICATIONS */}

        <button
          id="
            header-alerts-bell
          "

          type="button"

          onClick={() =>
            onNavigate(
              'alerts'
            )
          }

          className="
            relative
            p-2
            rounded-full
            text-on-surface-variant
            hover:bg-surface-container
            hover:text-primary
            transition-colors
            cursor-pointer
          "

          title="
            View Alerts
          "

          aria-label="
            Notifications
          "
        >

          <Bell
            className="
              w-5
              h-5
            "
          />


          {alertCount >
          0 && (

            <span
              className="
                absolute
                top-1
                right-1
                min-w-[16px]
                h-4
                px-1
                bg-error
                text-on-error
                rounded-full
                text-[10px]
                font-extrabold
                flex
                items-center
                justify-center
              "
            >

              {alertCount}

            </span>

          )}

        </button>


        {/* =====================================================
            PROFILE
        ===================================================== */}

        <div
          className="
            relative
          "
        >

          <button
            id="
              header-profile-avatar
            "

            type="button"

            onClick={() => {

              setShowProfileMenu(
                !showProfileMenu
              );

              setShowRoleMenu(
                false
              );

            }}

            className="
              cursor-pointer
              flex
              items-center
              p-0.5
              rounded-full
              hover:ring-2
              hover:ring-primary/20
              transition-all
            "

            title={
              `${userName} - ${roleLabel}`
            }

            aria-label="
              User Profile Menu
            "
          >

            <div
              className="
                w-8
                h-8
                rounded-full
                bg-primary-container
                text-primary
                border
                border-outline-variant
                flex
                items-center
                justify-center
                text-xs
                font-extrabold
              "
            >
              {initials}
            </div>

          </button>


          {showProfileMenu && (

            <>

              <div
                className="
                  fixed
                  inset-0
                  z-40
                "

                onClick={() =>
                  setShowProfileMenu(
                    false
                  )
                }
              />


              <div
                className="
                  absolute
                  right-0
                  mt-2
                  w-64
                  rounded-2xl
                  bg-surface-container-lowest
                  border
                  border-outline-variant
                  shadow-xl
                  p-3
                  z-50
                "
              >


                {/* USER */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    pb-3
                    border-b
                    border-outline-variant/50
                  "
                >

                  <div
                    className="
                      w-10
                      h-10
                      rounded-full
                      bg-primary-container
                      text-primary
                      border
                      border-outline-variant
                      flex
                      items-center
                      justify-center
                      text-sm
                      font-extrabold
                      shrink-0
                    "
                  >
                    {initials}
                  </div>


                  <div
                    className="
                      flex-1
                      min-w-0
                    "
                  >

                    <p
                      className="
                        text-sm
                        font-bold
                        text-on-surface
                        truncate
                      "
                    >
                      {userName}
                    </p>


                    <p
                      className="
                        text-[11px]
                        font-semibold
                        text-secondary
                        truncate
                      "
                    >
                      {roleLabel}
                    </p>


                    {isAdmin && (

                      <p
                        className="
                          text-[10px]
                          font-bold
                          text-primary
                          mt-0.5
                        "
                      >
                        Full Role Access
                      </p>

                    )}


                    {!isAdmin && (

                      <div
                        className="
                          flex
                          items-center
                          gap-1
                          text-[10px]
                          text-on-surface-variant
                          mt-0.5
                        "
                      >

                        <span
                          className={`
                            w-1.5
                            h-1.5
                            rounded-full

                            ${
                              authUser
                                ?.kycStatus ===
                              'verified'

                                ? 'bg-emerald-500'

                                : 'bg-amber-500'
                            }
                          `}
                        />

                        <span>

                          {authUser
                            ?.kycStatus ===
                          'verified'

                            ? 'KYC: Verified'

                            : 'KYC: Pending'}

                        </span>

                      </div>

                    )}

                  </div>

                </div>


                {/* MOBILE */}

                {authUser
                  ?.mobileNumber && (

                  <div
                    className="
                      px-3
                      py-2
                      mt-2
                      rounded-xl
                      bg-surface-container-low
                    "
                  >

                    <p
                      className="
                        text-[10px]
                        text-on-surface-variant
                        font-semibold
                        uppercase
                        tracking-wide
                      "
                    >
                      Mobile
                    </p>

                    <p
                      className="
                        text-xs
                        font-bold
                        text-on-surface
                        mt-0.5
                      "
                    >
                      +91 {
                        authUser
                          .mobileNumber
                      }
                    </p>

                  </div>

                )}


                {/* MENU */}

                <div
                  className="
                    py-2
                    space-y-1
                  "
                >

                  <button
                    type="button"

                    onClick={() => {

                      setShowProfileMenu(
                        false
                      );

                      onNavigate(
                        'settings'
                      );

                    }}

                    className="
                      w-full
                      text-left
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-on-surface
                      hover:bg-surface-container
                      rounded-xl
                      transition-colors
                      cursor-pointer
                    "
                  >
                    Account Settings
                  </button>


                  <button
                    type="button"

                    onClick={() => {

                      setShowProfileMenu(
                        false
                      );

                      onNavigate(
                        homeScreen
                      );

                    }}

                    className="
                      w-full
                      text-left
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-on-surface
                      hover:bg-surface-container
                      rounded-xl
                      transition-colors
                      cursor-pointer
                    "
                  >

                    {isAdmin
                      ? 'Admin Home'
                      : 'My Dashboard'}

                  </button>


                  <button
                    type="button"

                    onClick={() => {

                      setShowProfileMenu(
                        false
                      );

                      onNavigate(
                        'landing'
                      );

                    }}

                    className="
                      w-full
                      text-left
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-on-surface
                      hover:bg-surface-container
                      rounded-xl
                      transition-colors
                      cursor-pointer
                    "
                  >
                    Public Landing
                  </button>

                </div>


                {/* LOGOUT */}

                {onLogout && (

                  <div
                    className="
                      pt-2
                      border-t
                      border-outline-variant/50
                    "
                  >

                    <button
                      type="button"

                      id="
                        btn-header-signout
                      "

                      onClick={() => {

                        setShowProfileMenu(
                          false
                        );

                        onLogout();

                      }}

                      className="
                        w-full
                        flex
                        items-center
                        justify-between
                        px-3
                        py-2
                        text-xs
                        font-bold
                        text-error
                        hover:bg-error-container
                        rounded-xl
                        transition-colors
                        cursor-pointer
                      "
                    >

                      <span>
                        Sign Out
                      </span>

                      <LogOut
                        className="
                          w-3.5
                          h-3.5
                        "
                      />

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