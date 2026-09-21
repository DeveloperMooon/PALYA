import { useState } from 'react';

import {
  AnimatePresence,
  motion,
  useReducedMotion
} from 'motion/react';

import {
  Sun,
  Moon,
  Monitor,
  Pencil,
  Save,
  X,
  CheckCircle2,
  LoaderCircle
} from 'lucide-react';

import {
  useTheme
} from '../../context/ThemeContext';

import {
  useAuth
} from '../../context/AuthContext';

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

export const SettingsScreen = () => {
  const { themeMode, setThemeMode } = useTheme();

    const { user, updateProfile } = useAuth();
  const reduceMotion = useReducedMotion();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [age, setAge] = useState(user?.age?.toString() ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const showAge =
    user?.role === 'livestock_owner' ||
    user?.role === 'veterinarian';
    const handleCancel = () => {
    setFullName(user?.fullName ?? '');
    setAge(user?.age?.toString() ?? '');
    setSaveError('');
    setSaveSuccess(false);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaveError('');
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      await updateProfile(
        fullName.trim(),
        showAge && age ? Number(age) : undefined
      );

      setSaveSuccess(true);
      setIsEditing(false);

      window.setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
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

  return (
    <div className="w-full max-w-[800px] text-left">
      <h1 className="text-2xl font-bold tracking-tight text-on-surface">
        Settings
      </h1>

      <p className="mt-1 text-sm text-on-surface-variant">
        Manage your preferences.
      </p>
            <section
        aria-labelledby="profile-heading"
        className="mt-8 border-b border-outline-variant/50 pb-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="profile-heading"
              className="text-sm font-semibold text-on-surface"
            >
              Profile
            </h2>

            <p className="mt-1 text-xs text-on-surface-variant">
              Manage your personal information.
            </p>
          </div>

          {!isEditing && (
            <motion.button
              type="button"
              whileTap={reduceMotion ? undefined : { scale: 0.96 }}
              onClick={() => {
                setSaveError('');
                setSaveSuccess(false);
                setIsEditing(true);
              }}
              className="inline-flex min-h-9 items-center gap-2 rounded-md
                border border-outline-variant/50 px-3 text-xs font-medium
                text-on-surface transition-colors duration-150
                hover:bg-surface-container
                focus-visible:outline-2 focus-visible:outline-offset-2
                focus-visible:outline-primary"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {isEditing ? (
            <motion.form
              key="profile-form"
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, height: 0, y: -6 }
              }
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, height: 0, y: -6 }
              }
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              onSubmit={(event) => {
                event.preventDefault();
                void handleSave();
              }}
              className="overflow-hidden"
            >
              <div className="mt-5 grid max-w-xl gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-xs font-medium text-on-surface">
                  Name

                  <input
                    type="text"
                    value={fullName}
                    required
                    disabled={isSaving}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                    className="min-h-10 rounded-md border
                      border-outline-variant/50
                      bg-surface-container-low px-3 text-sm
                      text-on-surface outline-none
                      transition-colors duration-150
                      placeholder:text-on-surface-variant
                      focus:border-primary focus:ring-2
                      focus:ring-primary/20 disabled:opacity-60"
                    placeholder="Enter your name"
                  />
                </label>

                {showAge && (
                  <label className="flex flex-col gap-1.5 text-xs font-medium text-on-surface">
                    Age

                    <input
                      type="number"
                      value={age}
                      min={1}
                      max={120}
                      required
                      disabled={isSaving}
                      onChange={(event) =>
                        setAge(event.target.value)
                      }
                      className="min-h-10 rounded-md border
                        border-outline-variant/50
                        bg-surface-container-low px-3 text-sm
                        text-on-surface outline-none
                        transition-colors duration-150
                        placeholder:text-on-surface-variant
                        focus:border-primary focus:ring-2
                        focus:ring-primary/20 disabled:opacity-60"
                      placeholder="Enter your age"
                    />
                  </label>
                )}
              </div>

              {saveError && (
                <p
                  role="alert"
                  className="mt-3 text-xs text-error"
                >
                  {saveError}
                </p>
              )}

              <div className="mt-4 flex items-center gap-2">
                <motion.button
                  type="submit"
                  disabled={isSaving || !fullName.trim()}
                  whileTap={
                    reduceMotion || isSaving
                      ? undefined
                      : { scale: 0.96 }
                  }
                  className="inline-flex min-h-9 items-center gap-2
                    rounded-md bg-primary px-3 text-xs font-semibold
                    text-on-primary transition-opacity duration-150
                    hover:opacity-90 disabled:cursor-not-allowed
                    disabled:opacity-50"
                >
                  {isSaving ? (
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}

                  {isSaving ? 'Saving...' : 'Save'}
                </motion.button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleCancel}
                  className="inline-flex min-h-9 items-center gap-2
                    rounded-md px-3 text-xs font-medium
                    text-on-surface-variant transition-colors
                    duration-150 hover:bg-surface-container
                    hover:text-on-surface disabled:opacity-50"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="profile-details"
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
              className="mt-5 flex flex-wrap gap-x-12 gap-y-4"
            >
              <div>
                <p className="text-xs text-on-surface-variant">
                  Name
                </p>

                <p className="mt-1 text-sm font-medium text-on-surface">
                  {user?.fullName || 'Not provided'}
                </p>
              </div>

              {showAge && (
                <div>
                  <p className="text-xs text-on-surface-variant">
                    Age
                  </p>

                  <p className="mt-1 text-sm font-medium text-on-surface">
                    {user?.age ?? 'Not provided'}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {saveSuccess && (
            <motion.p
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, y: -4 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 inline-flex items-center gap-1.5
                text-xs font-medium text-primary"
            >
              <CheckCircle2 className="h-4 w-4" />
              Profile updated
            </motion.p>
          )}
        </AnimatePresence>
      </section>

      <section
        aria-labelledby="appearance-heading"
        className="mt-8 flex flex-col gap-4 border-b border-outline-variant/50 pb-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2
            id="appearance-heading"
            className="text-sm font-semibold text-on-surface"
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
          className="inline-flex self-start shrink-0 items-center gap-1 rounded-lg border border-outline-variant/40 bg-surface-container-low p-1 sm:self-auto"
        >
          {themeOptions.map(({ value, label, icon: Icon }) => {
            const selected = themeMode === value;

            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => setThemeMode(value)}
                className={`inline-flex min-h-10 items-center justify-center
                  gap-2 rounded-md border px-3 text-xs font-medium
                  transition-colors duration-150
                  motion-reduce:transition-none
                  focus-visible:outline-2 focus-visible:outline-offset-2
                  focus-visible:outline-primary ${
                    selected
                      ? 'border-outline-variant bg-surface-container-high text-on-surface shadow-sm'
                      : 'border-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Future settings rows go here */}
    </div>
  );
};