import {
  useEffect,
  useState,
} from 'react';

import {
  motion,
  useReducedMotion,
} from 'motion/react';

import {
  Building2,
  CheckCircle2,
  ExternalLink,
  LoaderCircle,
  LocateFixed,
  Monitor,
  Moon,
  Pencil,
  Save,
  Sun,
  UserRound,
  X,
} from 'lucide-react';

import {
  useTheme,
} from '../../context/ThemeContext';

import {
  useAuth,
} from '../../context/AuthContext';

const themeOptions = [
  {
    value: 'light',
    label: 'Light',
    icon: Sun,
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: Moon,
  },
  {
    value: 'system',
    label: 'System',
    icon: Monitor,
  },
] as const;

export const SettingsScreen = () => {
  const {
    themeMode,
    setThemeMode,
  } = useTheme();

  const {
    user,
    updateProfile,
  } = useAuth();

  const reduceMotion =
    useReducedMotion();

  const [isEditing, setIsEditing] =
    useState(false);

  const [fullName, setFullName] =
    useState(
      user?.fullName ?? ''
    );

  const [age, setAge] =
    useState(
      user?.age?.toString() ?? ''
    );

  const [farmName, setFarmName] =
    useState(
      user?.farmName ?? ''
    );

  const [
    farmLatitude,
    setFarmLatitude,
  ] = useState<number | undefined>(
    user?.farmLatitude
  );

  const [
    farmLongitude,
    setFarmLongitude,
  ] = useState<number | undefined>(
    user?.farmLongitude
  );

  const [isLocating, setIsLocating] =
    useState(false);

  const [
    locationError,
    setLocationError,
  ] = useState('');

  const [isSaving, setIsSaving] =
    useState(false);

  const [saveError, setSaveError] =
    useState('');

  const [
    saveSuccess,
    setSaveSuccess,
  ] = useState(false);

  const showAge =
    user?.role === 'livestock_owner' ||
    user?.role === 'veterinarian';

  const showFarmProfile =
    user?.role === 'livestock_owner';

  const hasFarmLocation =
    farmLatitude !== undefined &&
    farmLongitude !== undefined;

  useEffect(() => {
    if (isEditing) {
      return;
    }

    setFullName(
      user?.fullName ?? ''
    );

    setAge(
      user?.age?.toString() ?? ''
    );

    setFarmName(
      user?.farmName ?? ''
    );

    setFarmLatitude(
      user?.farmLatitude
    );

    setFarmLongitude(
      user?.farmLongitude
    );

    setLocationError('');
  }, [
    user,
    isEditing,
  ]);

  const handleCancel = () => {
    setFullName(
      user?.fullName ?? ''
    );

    setAge(
      user?.age?.toString() ?? ''
    );

    setFarmName(
      user?.farmName ?? ''
    );

    setFarmLatitude(
      user?.farmLatitude
    );

    setFarmLongitude(
      user?.farmLongitude
    );

    setLocationError('');
    setSaveError('');
    setSaveSuccess(false);
    setIsEditing(false);
  };

  const handleUseCurrentLocation =
    () => {
      setLocationError('');
      setSaveError('');

      if (!navigator.geolocation) {
        setLocationError(
          'Geolocation is not supported on this device.'
        );

        return;
      }

      setIsLocating(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFarmLatitude(
            Number(
              position.coords.latitude.toFixed(
                6
              )
            )
          );

          setFarmLongitude(
            Number(
              position.coords.longitude.toFixed(
                6
              )
            )
          );

          setIsLocating(false);
        },
        (error) => {
          let message =
            'Current farm location could not be determined.';

          if (error.code === 1) {
            message =
              'Location permission was denied. Allow location access in browser settings.';
          }

          if (error.code === 2) {
            message =
              'Location is unavailable. Turn on device location and try again.';
          }

          if (error.code === 3) {
            message =
              'Location request timed out. Try again in an open area.';
          }

          setLocationError(message);
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    };

  const handleSave = async () => {
    setSaveError('');
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      await updateProfile(
        fullName.trim(),
        showAge && age
          ? Number(age)
          : undefined,
        showFarmProfile
          ? farmName.trim()
          : undefined,
        showFarmProfile
          ? farmLatitude
          : undefined,
        showFarmProfile
          ? farmLongitude
          : undefined
      );

      setSaveSuccess(true);
      setIsEditing(false);

      window.setTimeout(() => {
        setSaveSuccess(false);
      }, 2500);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : 'Unable to update profile.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const inputClassName = `
    min-h-11 w-full rounded-xl border
    border-outline-variant/60
    bg-surface-container-low px-3.5
    text-sm text-on-surface outline-none
    transition-colors duration-150
    placeholder:text-on-surface-variant
    focus:border-primary focus:ring-2
    focus:ring-primary/20
    disabled:cursor-not-allowed
    disabled:opacity-60
  `;

  return (
    <div className="w-full max-w-[900px] pb-12 text-left">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            Settings
          </h1>

          <p className="mt-1 text-sm text-on-surface-variant">
            Manage your profile, farm details and preferences.
          </p>
        </div>

        {!isEditing && (
          <motion.button
            type="button"
            whileTap={
              reduceMotion
                ? undefined
                : { scale: 0.96 }
            }
            onClick={() => {
              setSaveError('');
              setSaveSuccess(false);
              setIsEditing(true);
            }}
            className="
              inline-flex min-h-10 items-center
              justify-center gap-2 self-start
              rounded-xl border
              border-outline-variant/60
              bg-surface-container-lowest
              px-4 text-xs font-semibold
              text-on-surface shadow-sm
              transition-colors
              hover:bg-surface-container
            "
          >
            <Pencil className="h-4 w-4" />
            Edit profile
          </motion.button>
        )}
      </div>

      {saveSuccess && (
        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: -5,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            mt-5 flex items-center gap-2
            rounded-xl border border-primary/25
            bg-primary/10 px-4 py-3
            text-xs font-semibold text-primary
          "
        >
          <CheckCircle2 className="h-4 w-4" />
          Profile updated successfully
        </motion.div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSave();
        }}
        className="mt-7 space-y-5"
      >
        <section
          aria-labelledby="personal-profile-heading"
          className="
            overflow-hidden rounded-2xl
            border border-outline-variant/60
            bg-surface-container-lowest
            shadow-sm
          "
        >
          <div className="flex items-center gap-3 border-b border-outline-variant/40 px-5 py-4 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserRound className="h-5 w-5" />
            </div>

            <div>
              <h2
                id="personal-profile-heading"
                className="text-sm font-bold text-on-surface"
              >
                Personal Profile
              </h2>

              <p className="mt-0.5 text-xs text-on-surface-variant">
                Your personal account information.
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {isEditing ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-xs font-semibold text-on-surface">
                  Full Name

                  <input
                    type="text"
                    value={fullName}
                    required
                    minLength={2}
                    maxLength={100}
                    disabled={isSaving}
                    onChange={(event) =>
                      setFullName(
                        event.target.value
                      )
                    }
                    className={inputClassName}
                    placeholder="Enter your full name"
                  />
                </label>

                {showAge && (
                  <label className="flex flex-col gap-2 text-xs font-semibold text-on-surface">
                    Age

                    <input
                      type="number"
                      value={age}
                      required
                      min={1}
                      max={120}
                      disabled={isSaving}
                      onChange={(event) =>
                        setAge(
                          event.target.value
                        )
                      }
                      className={inputClassName}
                      placeholder="Enter your age"
                    />
                  </label>
                )}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-on-surface-variant">
                    Full Name
                  </p>

                  <p className="mt-1.5 text-sm font-semibold text-on-surface">
                    {user?.fullName ||
                      'Not provided'}
                  </p>
                </div>

                {showAge && (
                  <div>
                    <p className="text-xs font-medium text-on-surface-variant">
                      Age
                    </p>

                    <p className="mt-1.5 text-sm font-semibold text-on-surface">
                      {user?.age ??
                        'Not provided'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {showFarmProfile && (
          <section
            aria-labelledby="farm-profile-heading"
            className="
              overflow-hidden rounded-2xl
              border border-outline-variant/60
              bg-surface-container-lowest
              shadow-sm
            "
          >
            <div className="flex items-center gap-3 border-b border-outline-variant/40 px-5 py-4 sm:px-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <Building2 className="h-5 w-5" />
              </div>

              <div>
                <h2
                  id="farm-profile-heading"
                  className="text-sm font-bold text-on-surface"
                >
                  Farm Profile
                </h2>

                <p className="mt-0.5 text-xs text-on-surface-variant">
                  Farm identity, registered address and GPS location.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {isEditing ? (
                <div className="space-y-5">
                  <label className="flex max-w-xl flex-col gap-2 text-xs font-semibold text-on-surface">
                    Farm Name

                    <input
                      type="text"
                      value={farmName}
                      required
                      minLength={2}
                      maxLength={100}
                      disabled={isSaving}
                      onChange={(event) =>
                        setFarmName(
                          event.target.value
                        )
                      }
                      className={inputClassName}
                      placeholder="Enter your farm name"
                    />
                  </label>

                  <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-bold text-on-surface">
                          Exact Farm Location
                        </p>

                        <p className="mt-1 text-xs leading-5 text-on-surface-variant">
                          Stand at the farm and capture the device GPS location.
                        </p>
                      </div>

                      <motion.button
                        type="button"
                        disabled={
                          isLocating ||
                          isSaving
                        }
                        whileTap={
                          reduceMotion ||
                          isLocating
                            ? undefined
                            : { scale: 0.96 }
                        }
                        onClick={
                          handleUseCurrentLocation
                        }
                        className="
                          inline-flex min-h-10
                          shrink-0 items-center
                          justify-center gap-2
                          rounded-xl bg-primary
                          px-4 text-xs font-bold
                          text-on-primary
                          transition-opacity
                          hover:opacity-90
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        {isLocating ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <LocateFixed className="h-4 w-4" />
                        )}

                        {isLocating
                          ? 'Detecting...'
                          : hasFarmLocation
                            ? 'Update Location'
                            : 'Use Current Location'}
                      </motion.button>
                    </div>

                    {hasFarmLocation && (
                      <div className="mt-4 rounded-lg bg-primary/10 px-3 py-2.5">
                        <p className="text-xs font-semibold text-primary">
                          Location captured
                        </p>

                        <p className="mt-1 font-mono text-[11px] text-on-surface-variant">
                          {farmLatitude?.toFixed(
                            6
                          )}
                          {', '}
                          {farmLongitude?.toFixed(
                            6
                          )}
                        </p>
                      </div>
                    )}

                    {locationError && (
                      <p
                        role="alert"
                        className="mt-3 text-xs font-medium text-error"
                      >
                        {locationError}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium text-on-surface-variant">
                        Registered Address
                      </p>

                      <p className="mt-1.5 text-sm font-semibold text-on-surface">
                        {user?.address ||
                          'Not provided'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-on-surface-variant">
                        Pincode
                      </p>

                      <p className="mt-1.5 text-sm font-semibold text-on-surface">
                        {user?.pincode ||
                          'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-on-surface-variant">
                      Farm Name
                    </p>

                    <p className="mt-1.5 text-sm font-semibold text-on-surface">
                      {user?.farmName ||
                        'Not provided'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-on-surface-variant">
                      Registered Address
                    </p>

                    <p className="mt-1.5 text-sm font-semibold text-on-surface">
                      {user?.address ||
                        'Not provided'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-on-surface-variant">
                      Pincode
                    </p>

                    <p className="mt-1.5 text-sm font-semibold text-on-surface">
                      {user?.pincode ||
                        'Not provided'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-on-surface-variant">
                      GPS Location
                    </p>

                    {user?.farmLatitude !==
                      undefined &&
                    user?.farmLongitude !==
                      undefined ? (
                      <div className="mt-1.5">
                        <p className="font-mono text-xs font-semibold text-on-surface">
                          {user.farmLatitude.toFixed(
                            6
                          )}
                          {', '}
                          {user.farmLongitude.toFixed(
                            6
                          )}
                        </p>

                        <a
                          href={`https://www.google.com/maps?q=${user.farmLatitude},${user.farmLongitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          Open in Maps
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    ) : (
                      <p className="mt-1.5 text-sm font-semibold text-on-surface">
                        Not captured
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {saveError && (
          <p
            role="alert"
            className="
              rounded-xl border border-error/30
              bg-error/10 px-4 py-3
              text-xs font-medium text-error
            "
          >
            {saveError}
          </p>
        )}

        {isEditing && (
          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              type="submit"
              disabled={
                isSaving ||
                !fullName.trim() ||
                (
                  showFarmProfile &&
                  !farmName.trim()
                )
              }
              whileTap={
                reduceMotion ||
                isSaving
                  ? undefined
                  : { scale: 0.96 }
              }
              className="
                inline-flex min-h-10
                items-center gap-2 rounded-xl
                bg-primary px-5
                text-xs font-bold
                text-on-primary
                transition-opacity
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isSaving ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {isSaving
                ? 'Saving...'
                : 'Save Changes'}
            </motion.button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleCancel}
              className="
                inline-flex min-h-10
                items-center gap-2
                rounded-xl px-4
                text-xs font-semibold
                text-on-surface-variant
                transition-colors
                hover:bg-surface-container
                hover:text-on-surface
                disabled:opacity-50
              "
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        )}
      </form>

      <section
        aria-labelledby="appearance-heading"
        className="
          mt-5 overflow-hidden
          rounded-2xl border
          border-outline-variant/60
          bg-surface-container-lowest
          shadow-sm
        "
      >
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2
              id="appearance-heading"
              className="text-sm font-bold text-on-surface"
            >
              Appearance
            </h2>

            <p className="mt-1 text-xs text-on-surface-variant">
              Choose a theme or follow your device.
            </p>
          </div>

          <div
            role="group"
            aria-label="Theme preference"
            className="
              inline-flex self-start
              items-center gap-1 rounded-xl
              border border-outline-variant/40
              bg-surface-container-low p-1
            "
          >
            {themeOptions.map(
              ({
                value,
                label,
                icon: Icon,
              }) => {
                const selected =
                  themeMode === value;

                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={
                      selected
                    }
                    onClick={() =>
                      setThemeMode(
                        value
                      )
                    }
                    className={`
                      inline-flex min-h-10
                      items-center justify-center
                      gap-2 rounded-lg border
                      px-3 text-xs font-medium
                      transition-colors
                      focus-visible:outline-2
                      focus-visible:outline-offset-2
                      focus-visible:outline-primary
                      ${
                        selected
                          ? 'border-outline-variant bg-surface-container-high text-on-surface shadow-sm'
                          : 'border-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      }
                    `}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* Future settings sections go here */}
    </div>
  );
};