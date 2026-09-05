import React from 'react';
import {
  ShieldCheck,
  Activity,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  QrCode,
  HeartHandshake,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { ScreenId } from '../../types';
import { useTheme } from '../../context/ThemeContext'; // DARK MODE: theme hook import kiya

interface LandingScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
  // DARK MODE: current mode aur use switch karne wala function
  const { themeMode, setThemeMode } = useTheme();

  // DARK MODE: button dabane par light -> dark -> system -> light... cycle karega
  const cycleTheme = () => {
    if (themeMode === 'light') setThemeMode('dark');
    else if (themeMode === 'dark') setThemeMode('system');
    else setThemeMode('light');
  };

  // DARK MODE: current mode ke hisaab se sahi icon dikhane ke liye
  const ThemeIcon = themeMode === 'light' ? Sun : themeMode === 'dark' ? Moon : Monitor;

  return (
    // DARK MODE: hardcoded hex colors (#f8f9ff, #0b1c30) hata ke
    // token-based classes lagayi (bg-background, text-on-background) —
    // isse ye div bhi dark mode mein sahi se badlega
    <div className="min-h-screen bg-background text-on-background flex flex-col selection:bg-secondary-container">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-11 h-11 rounded-xl bg-white border border-outline-variant/50 p-1 flex items-center justify-center shadow-xs">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBalydRg2eY901DQK2BcFn0HHpPgj8oC_5_PwT4aicpLUc9fWMGzxQC1hlsTalrf3WDIr_KTdjwRrwHhq4bWUwc9TkkAR4BXck3D5lBKgU_aDdkHiLcZ3pBdWQ9TwFBGJ3u0VUBpynag1XIcOROJjPXrzhdffA3XPuDihVLnBlh9NHNTMWRKpq2Cf2zJ9jUcccRHbF6_vj1zEf8f9bV-vtEdPINyErirs4wpgY6II3UIKTjQVt2fHRiRg"
                alt="PALYA Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-2xl font-black text-primary tracking-tight">PALYA</span>
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                Health Stewardship
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-on-surface-variant">
            <a href="#why-palya" className="hover:text-primary transition-colors">Why PALYA</a>
            <a href="#features" className="hover:text-primary transition-colors">Platform Features</a>
            <a href="#compliance" className="hover:text-primary transition-colors">MRL & Food Safety</a>
            <a href="#governance" className="hover:text-primary transition-colors">One Health</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* DARK MODE: naya toggle button — click karne par mode cycle hoga */}
            <button
              onClick={cycleTheme}
              title={`Theme: ${themeMode} (click to change)`}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <ThemeIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('auth')}
              className="px-4 py-2 text-sm font-bold text-primary hover:bg-surface-container rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 bg-primary hover:bg-primary-container active:scale-[0.98] text-on-primary rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-4 h-4 text-secondary-fixed" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 hero-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-fixed/50 text-secondary border border-secondary/20 text-xs font-bold mb-6">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span>Aligned with FAO & WHO Global Action Plan on AMR</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary tracking-tight leading-[1.15]">
              Smarter Animal Care. <br />
              <span className="text-secondary">Safer Food.</span> Responsible Antibiotic Use.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-on-surface-variant leading-relaxed">
              A unified digital platform for livestock health management, electronic treatment records,
              antimicrobial-use (AMU) monitoring, and automated veterinary decision support.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-7 py-3.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-base font-extrabold shadow-lg hover:shadow-xl transition-all flex items-center gap-3 cursor-pointer"
              >
                <span>Enter Live Dashboard</span>
                <ArrowRight className="w-5 h-5 text-secondary-container" />
              </button>
              <button
                onClick={() => onNavigate('mrl')}
                className="px-6 py-3.5 bg-surface-container-lowest border border-outline-variant hover:bg-surface-container text-on-surface rounded-xl text-base font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Activity className="w-5 h-5 text-secondary" />
                <span>Try MRL Compliance Checker</span>
              </button>
            </div>
          </div>

          {/* Hero Monitor Dashboard Preview */}
          <div className="relative mt-12 max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden border-2 border-outline-variant/60 shadow-2xl bg-white">
              <div className="bg-surface-container-high px-4 py-3 border-b border-outline-variant/50 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-error/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="mx-auto text-xs font-mono text-on-surface-variant">
                  app.palya.gov.in/dashboard/health-stewardship
                </div>
              </div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-EohmfJaW7imWe9L2txypC8jKwQUFz3bwzK70eunp8EuFNKheW7m7InYi8PWfgIVRQ3RxWR3UcKQ-MaOPz748Spw7fCFzjd48DSgCbiO4itH1nDAAzcNTI9hbXgfKjLNOTeABnjXPVyrBim2KF-1hEe6zSpwv7GSJHevpXQp8r_aYX_6qHnuLcHRLBoKM7230cgz58knkDHLKPnSBdQF3yPhunwAnZ_76VuH_3SRJbY8r75ShQdSldg"
                alt="PALYA Health Stewardship Live Dashboard"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-20 bg-surface-container-low border-t border-outline-variant/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-secondary">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-primary mt-2">
              Engineered for Complete Food-Chain Transparency
            </h2>
            <p className="mt-3 text-base text-on-surface-variant">
              From village farm level up to state and national regulatory bodies, PALYA connects every dose to safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed/40 text-secondary flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">Digital Livestock Records</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Complete electronic health passport, RFID ear-tag tracking, and disease surveillance for cattle, buffalo, goats, and sheep.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">Automated MRL Compliance</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Real-time Maximum Residue Limit verification and active withdrawal timers prevent contaminated milk and meat entry.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-secondary-container/40 text-on-secondary-container flex items-center justify-center mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">Responsible AMU Analytics</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Automated calculation of mg/PCU antimicrobial usage, drug class breakdown, and stewardship benchmarks.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-error-container/40 text-error flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">Early Risk & HP-CIA Alerts</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Flags repeated antibiotic treatments within 30 days, unauthorized 3rd/4th gen cephalosporin usage, and treatment failures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-primary text-on-primary py-12 border-t border-primary-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white p-1">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBalydRg2eY901DQK2BcFn0HHpPgj8oC_5_PwT4aicpLUc9fWMGzxQC1hlsTalrf3WDIr_KTdjwRrwHhq4bWUwc9TkkAR4BXck3D5lBKgU_aDdkHiLcZ3pBdWQ9TwFBGJ3u0VUBpynag1XIcOROJjPXrzhdffA3XPuDihVLnBlh9NHNTMWRKpq2Cf2zJ9jUcccRHbF6_vj1zEf8f9bV-vtEdPINyErirs4wpgY6II3UIKTjQVt2fHRiRg"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-extrabold text-lg tracking-tight">PALYA Health Stewardship</span>
          </div>

          <p className="text-xs text-on-primary-container text-center md:text-left">
            © 2026 PALYA Platform • National Livestock & Food Safety Digital Architecture
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold text-on-primary-container">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-white">Live App</button>
            <span>•</span>
            <button onClick={() => onNavigate('mrl')} className="hover:text-white">MRL Standards</button>
            <span>•</span>
            <button onClick={() => onNavigate('auth')} className="hover:text-white">Portal Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
};