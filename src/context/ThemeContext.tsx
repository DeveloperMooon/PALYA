import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Teen options: 'light' (hamesha light), 'dark' (hamesha dark),
// 'system' (jo phone/computer ki setting hai wahi follow karo)
type ThemeMode = 'light' | 'dark' | 'system';

// localStorage mein user ki choice save karne ke liye key ka naam
const STORAGE_KEY = 'palya-theme-mode';

interface ThemeContextType {
  // User ne kya choose kiya hai (light/dark/system)
  themeMode: ThemeMode;

  // Actually kya dikh raha hai screen par (system ko resolve karke)
  resolvedTheme: 'light' | 'dark';

  // Profile screen se ye function call karke theme badlenge
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// System ka current preference check karta hai (dark hai ya light)
function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {

  // Page load hote hi localStorage check karo — agar user ne
  // pehle se koi choice save ki hai to wahi use karo, warna 'system'
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
    return 'system';
  });

  // Actual resolved theme (agar mode 'system' hai to system se pata karo)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    return themeMode === 'system' ? getSystemTheme() : themeMode;
  });

  // Jab bhi themeMode badle, resolvedTheme recalculate karo
  // aur <html> tag par 'dark' class laga/hata do
  useEffect(() => {
    const newResolvedTheme =
      themeMode === 'system' ? getSystemTheme() : themeMode;

    setResolvedTheme(newResolvedTheme);

    // Yahi wo line hai jo index.css ke .dark { ... } block ko trigger karti hai
    if (newResolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // User ki choice yaad rakhne ke liye save karo
    localStorage.setItem(STORAGE_KEY, themeMode);
  }, [themeMode]);

  // Agar user ne 'system' choose kiya hai, to agar wo apne phone/
  // computer ki setting beech mein badal de (bina app band kiye),
  // to hume bhi turant update hona chahiye — isliye listener lagate hain
  useEffect(() => {
    if (themeMode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const newTheme = getSystemTheme();
      setResolvedTheme(newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, resolvedTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Isse hum kisi bhi component mein "const { themeMode, setThemeMode } = useTheme();"
// likh ke theme access/change kar payenge
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}