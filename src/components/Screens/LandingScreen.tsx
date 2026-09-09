import React, { useState } from 'react';

import {
  Activity,
  ArrowRight,
  Bell,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileHeart,
  HeartPulse,
  Menu,
  Microscope,
  Monitor,
  Moon,
  PawPrint,
  ShieldCheck,
  Stethoscope,
  Sun,
  Syringe,
  Users,
  X
} from 'lucide-react';

import { ScreenId } from '../../types';
import { useTheme } from '../../context/ThemeContext';

/* =========================================================
   PROPS
========================================================= */

interface LandingScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

/* =========================================================
   COMPONENT
========================================================= */

export const LandingScreen:
  React.FC<LandingScreenProps> = ({
    onNavigate
  }) => {

  const {
    themeMode,
    setThemeMode
  } = useTheme();

  const [
    mobileMenuOpen,
    setMobileMenuOpen
  ] = useState(false);

  /* =======================================================
     THEME
  ======================================================= */

  const cycleTheme = () => {
    if (themeMode === 'light') {
      setThemeMode('dark');

    } else if (themeMode === 'dark') {
      setThemeMode('system');

    } else {
      setThemeMode('light');
    }
  };

  const ThemeIcon =
    themeMode === 'light'
      ? Sun
      : themeMode === 'dark'
        ? Moon
        : Monitor;

  /* =======================================================
     FEATURES
  ======================================================= */

  const mainFeatures = [
    {
      icon: PawPrint,

      title:
        'Digital Animal Records',

      description:
        'Maintain structured livestock profiles, health history, treatments, vaccination records and identification in one place.'
    },

    {
      icon: HeartPulse,

      title:
        'Early Disease Screening',

      description:
        'Species-specific rule-based clinical screening helps identify suspicious symptom patterns before veterinary verification.'
    },

    {
      icon: Stethoscope,

      title:
        'Veterinary Connection',

      description:
        'Escalate suspicious cases to veterinary review with animal history, clinical context and verified visit evidence.'
    }
  ];

  const users = [
    {
      icon: PawPrint,
      title: 'Farmers',
      description:
        'Manage animals, treatment history, withdrawal status and preventive health activities.'
    },

    {
      icon: Stethoscope,
      title: 'Veterinarians',
      description:
        'Review escalated cases, verify farm visits and authorize appropriate clinical actions.'
    },

    {
      icon: Microscope,
      title: 'Laboratories',
      description:
        'Support diagnostic workflows and structured reporting for veterinary decision-making.'
    },

    {
      icon: Building2,
      title: 'Authorities',
      description:
        'Monitor antimicrobial stewardship, compliance signals and livestock health indicators.'
    }
  ];

  const workflowSteps = [
    {
      number: '01',
      label: 'Onboarding',
      icon: Users,

      title:
        'Create Account',

      description:
        'Choose your role and enter the PALYA health stewardship platform.'
    },

    {
      number: '02',
      label: 'Registration',
      icon: PawPrint,

      title:
        'Add Animal',

      description:
        'Register species, breed, farm details and animal identification.'
    },

    {
      number: '03',
      label: 'Health Records',
      icon: FileHeart,

      title:
        'Track Health',

      description:
        'Maintain screening, treatment, vaccination and withdrawal information.'
    },

    {
      number: '04',
      label: 'Action & Care',
      icon: Stethoscope,

      title:
        'Get Support',

      description:
        'Use the digital assistant, early screening and veterinary workflow when support is required.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-emerald-200">

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between">

            {/* BRAND */}

            <button
              type="button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                })
              }
              className="flex items-center gap-3 cursor-pointer"
            >

              <div className="w-11 h-11 rounded-xl bg-white border border-emerald-100 shadow-sm overflow-hidden flex items-center justify-center">

                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_zloVXKb2vfI-mUu86cZTPV6qHLTQqS5lsj8OO_Rtqsp5LyvrIl84fJql9xk7CDoJr0OE6YENTyk3nDVDLRa-NjieETrgRrQlGPnmUnhKaWurmPhu2AxVqUTtgHzDfZpdGBaS2JQkKXkF_jCUTezbFQ04mqGlZP550uEycw4OTrTUGRWp0gV3H2enfWXPsNLYM2crSN5YFo6Fx56s6AqEvmJ6wkbwOhjjifP5bygglRNjjmoMavTqeQVIpt53Tf_mRuY"
                  alt="PALYA Logo"
                  className="w-full h-full object-contain"
                />

              </div>

              <div className="text-left">

                <span className="text-2xl font-black tracking-tight text-emerald-950 block leading-none">

                  PALYA

                </span>

                <span className="text-[10px] uppercase tracking-[0.18em] font-black text-emerald-700">

                  Health Stewardship

                </span>

              </div>

            </button>

            {/* DESKTOP LINKS */}

            <nav className="hidden lg:flex items-center gap-7 text-sm font-bold text-slate-600">

              <a
                href="#why-palya"
                className="hover:text-emerald-800 transition-colors"
              >
                Why PALYA
              </a>

              <a
                href="#how-it-works"
                className="hover:text-emerald-800 transition-colors"
              >
                How It Works
              </a>

              <a
                href="#for-users"
                className="hover:text-emerald-800 transition-colors"
              >
                For Users
              </a>

              <a
                href="#food-safety"
                className="hover:text-emerald-800 transition-colors"
              >
                Food Safety
              </a>

              <a
                href="#one-health"
                className="hover:text-emerald-800 transition-colors"
              >
                One Health
              </a>

            </nav>

            {/* DESKTOP ACTIONS */}

            <div className="hidden lg:flex items-center gap-2">

              <button
                type="button"
                onClick={cycleTheme}
                title={`Theme: ${themeMode}`}
                className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
              >

                <ThemeIcon className="w-4 h-4" />

              </button>

              <button
                type="button"
                onClick={() =>
                  onNavigate('auth')
                }
                className="px-4 py-2.5 text-sm font-bold text-slate-700 hover:text-emerald-900"
              >

                Sign In

              </button>

              <button
                type="button"
                onClick={() =>
                  onNavigate('dashboard')
                }
                className="px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-sm font-black flex items-center gap-2 shadow-md transition-all"
              >

                Launch Platform

                <ArrowRight className="w-4 h-4" />

              </button>

            </div>

            {/* MOBILE MENU */}

            <div className="lg:hidden flex items-center gap-2">

              <button
                type="button"
                onClick={cycleTheme}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center"
              >

                <ThemeIcon className="w-4 h-4" />

              </button>

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(
                    !mobileMenuOpen
                  )
                }
                className="w-10 h-10 rounded-lg hover:bg-slate-100 flex items-center justify-center"
              >

                {mobileMenuOpen
                  ? (
                      <X className="w-5 h-5" />
                    )
                  : (
                      <Menu className="w-5 h-5" />
                    )}

              </button>

            </div>

          </div>

          {/* MOBILE DRAWER */}

          {mobileMenuOpen && (

            <div className="lg:hidden pb-5 pt-2 border-t border-slate-100 space-y-2">

              {[
                ['#why-palya', 'Why PALYA'],
                ['#how-it-works', 'How It Works'],
                ['#for-users', 'For Users'],
                ['#food-safety', 'Food Safety'],
                ['#one-health', 'One Health']
              ].map(
                ([href, label]) => (

                  <a
                    key={href}
                    href={href}
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="block px-3 py-2 text-sm font-bold text-slate-700 rounded-lg hover:bg-slate-100"
                  >

                    {label}

                  </a>

                )
              )}

              <div className="grid grid-cols-2 gap-2 pt-3">

                <button
                  type="button"
                  onClick={() =>
                    onNavigate('auth')
                  }
                  className="py-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                >

                  Sign In

                </button>

                <button
                  type="button"
                  onClick={() =>
                    onNavigate('dashboard')
                  }
                  className="py-2.5 rounded-xl bg-emerald-900 text-white text-sm font-black"
                >

                  Launch Platform

                </button>

              </div>

            </div>

          )}

        </div>

      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        id="hero"
        className="relative overflow-hidden border-b border-slate-200"
        style={{
          backgroundColor:
            '#f8fafc',

          backgroundImage:
            'radial-gradient(#cbd5e1 0.8px, transparent 0.8px)',

          backgroundSize:
            '20px 20px'
        }}
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* HERO TEXT */}

            <div className="lg:col-span-6 text-center lg:text-left">

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-black tracking-wide">

                <HeartPulse className="w-4 h-4" />

                DIGITAL LIVESTOCK HEALTH STEWARDSHIP

              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[48px] leading-[1.12] font-black tracking-tight text-emerald-950">

                Smarter Animal Care.

                <br />

                Safer Food.

                <br />

                <span className="text-emerald-700">

                  Healthier Communities.

                </span>

              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">

                PALYA brings livestock health records,
                rule-based early disease screening,
                digital veterinary workflows,
                antimicrobial stewardship and food-safety
                monitoring into one connected platform.

              </p>

              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-3">

                <button
                  type="button"
                  onClick={() =>
                    onNavigate('dashboard')
                  }
                  className="px-7 py-3.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-sm sm:text-base font-black shadow-lg flex items-center justify-center gap-2 transition-all"
                >

                  Get Started

                  <ArrowRight className="w-5 h-5" />

                </button>

                <a
                  href="#how-it-works"
                  className="px-7 py-3.5 rounded-xl bg-white hover:bg-emerald-50 border-2 border-emerald-200 text-emerald-900 text-sm sm:text-base font-black flex items-center justify-center gap-2 transition"
                >

                  See How It Works

                  <ChevronRight className="w-4 h-4" />

                </a>

              </div>

              <div className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-xs font-bold text-slate-500">

                <ShieldCheck className="w-4 h-4 text-emerald-600" />

                Built for Farmers • Veterinarians • Laboratories • Authorities

              </div>

            </div>

            {/* HERO IMAGE */}

            <div className="lg:col-span-6 relative">

              <div className="absolute -inset-3 bg-emerald-300/20 blur-3xl rounded-full" />

              <div className="relative bg-white p-2 rounded-3xl border border-slate-200 shadow-2xl">

                <div className="relative overflow-hidden rounded-2xl">

                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAwCdBOkLcu_x5ov_Zmxt5z4Qrs0__T18KuZX3yPvMx6HRFzYIvDZGGPXiG063fyNbepsZuH1Xzf6qBDVYzTx9OzqNJVfN0s1mjO5RLaJzUhUyiXtYrmogMmAE1T57MRFXcvXCimI_CJvrzJSevOtpcZZrJaQ0N8xu8oxaEvzE24FXyAQ14CnOJEus8BXbQa6VjN1apt-NI4rbF3_QfpwQgT2IUWiU4Vr8oSc6Aymv071KcRa30knZPg"
                    alt="Livestock farmer with cattle"
                    className="w-full h-80 sm:h-96 lg:h-[420px] object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 grid grid-cols-2 gap-3">

                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">

                      <p className="text-[10px] uppercase font-black text-slate-400">

                        Animal Health

                      </p>

                      <p className="text-sm font-black text-emerald-900 mt-1">

                        Connected Records

                      </p>

                    </div>

                    <div className="bg-emerald-900/95 backdrop-blur-sm rounded-xl p-3 shadow-lg text-white">

                      <p className="text-[10px] uppercase font-black text-emerald-200">

                        Veterinary Support

                      </p>

                      <p className="text-sm font-black mt-1">

                        Integrated Workflow

                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          WHAT IS PALYA
      ===================================================== */}

      <section
        id="why-palya"
        className="py-20 bg-[#f0fdf9] border-b border-emerald-100"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-3xl mx-auto text-center">

            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs uppercase tracking-widest font-black">

              What is PALYA?

            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">

              One Simple Platform for Better Livestock Health

            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-600">

              PALYA organizes animal-health information and
              connects the people responsible for treatment,
              stewardship, monitoring and food safety.

            </p>

          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">

            {mainFeatures.map(
              (feature) => {

                const Icon =
                  feature.icon;

                return (

                  <div
                    key={feature.title}
                    className="bg-white rounded-2xl p-7 border border-emerald-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                  >

                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">

                      <Icon className="w-6 h-6" />

                    </div>

                    <h3 className="mt-5 text-xl font-black text-emerald-950">

                      {feature.title}

                    </h3>

                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">

                      {feature.description}

                    </p>

                  </div>

                );
              }
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          FOR USERS
      ===================================================== */}

      <section
        id="for-users"
        className="py-20 bg-white border-b border-slate-200"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto">

            <span className="text-xs uppercase tracking-widest font-black text-emerald-700">

              Connected Ecosystem

            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-emerald-950">

              Built for Everyone Involved in Animal Health

            </h2>

            <p className="mt-3 text-slate-600">

              One platform, different role-specific workflows.

            </p>

          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {users.map(
              (user) => {

                const Icon =
                  user.icon;

                return (

                  <div
                    key={user.title}
                    className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-6"
                  >

                    <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-800 shadow-sm">

                      <Icon className="w-5 h-5" />

                    </div>

                    <h3 className="mt-4 text-lg font-black text-emerald-950">

                      {user.title}

                    </h3>

                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">

                      {user.description}

                    </p>

                  </div>

                );
              }
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          BEFORE / AFTER
      ===================================================== */}

      <section className="py-20 bg-slate-50 border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* BEFORE */}

            <div className="rounded-3xl bg-white border border-red-100 p-7 sm:p-8">

              <span className="text-xs uppercase tracking-widest font-black text-red-600">

                Traditional Workflow

              </span>

              <h2 className="mt-3 text-2xl font-black text-slate-900">

                Fragmented Animal Health Records

              </h2>

              <div className="mt-6 space-y-4">

                {[
                  'Paper-based or scattered treatment records',
                  'Limited visibility of repeated antimicrobial use',
                  'Withdrawal periods are difficult to track',
                  'Veterinary information may remain disconnected',
                  'Farm-level history can be lost or incomplete'
                ].map(
                  (item) => (

                    <div
                      key={item}
                      className="flex items-start gap-3"
                    >

                      <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />

                      <p className="text-sm text-slate-600">

                        {item}

                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* AFTER */}

            <div className="rounded-3xl bg-emerald-950 p-7 sm:p-8 text-white shadow-xl">

              <span className="text-xs uppercase tracking-widest font-black text-emerald-300">

                With PALYA

              </span>

              <h2 className="mt-3 text-2xl font-black">

                Connected Digital Health Stewardship

              </h2>

              <div className="mt-6 space-y-4">

                {[
                  'Digital animal records linked to unique livestock profiles',
                  'Structured antimicrobial-use and treatment history',
                  'Withdrawal monitoring for food-safety awareness',
                  'Connected veterinary review and verification',
                  'Centralized health information for better decisions'
                ].map(
                  (item) => (

                    <div
                      key={item}
                      className="flex items-start gap-3"
                    >

                      <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />

                      <p className="text-sm text-emerald-50">

                        {item}

                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        id="how-it-works"
        className="py-20 bg-white border-b border-slate-200 scroll-mt-24"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto">

            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs uppercase tracking-widest font-black">

              Step-by-Step

            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl font-black text-emerald-950">

              How PALYA Works

            </h2>

            <p className="mt-3 text-slate-600">

              From livestock registration to health tracking
              and veterinary intervention in four simple steps.

            </p>

          </div>

          <div className="relative mt-16">

            <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] border-t-2 border-dashed border-emerald-300" />

            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {workflowSteps.map(
                (step) => {

                  const Icon =
                    step.icon;

                  return (

                    <div
                      key={step.number}
                      className="bg-[#f8fafc] rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all"
                    >

                      <div className="flex items-center justify-between">

                        <span className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-white shadow flex items-center justify-center text-sm font-black text-emerald-800">

                          {step.number}

                        </span>

                        <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">

                          {step.label}

                        </span>

                      </div>

                      <div className="mt-5 h-28 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 flex items-center justify-center">

                        <div className="text-center">

                          <div className="mx-auto w-11 h-11 rounded-full bg-white shadow-sm text-emerald-800 flex items-center justify-center">

                            <Icon className="w-5 h-5" />

                          </div>

                        </div>

                      </div>

                      <h3 className="mt-5 text-lg font-black text-slate-900">

                        {step.title}

                      </h3>

                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">

                        {step.description}

                      </p>

                    </div>

                  );
                }
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          PRODUCT PREVIEW
      ===================================================== */}

      <section className="py-20 bg-emerald-50/50 border-b border-emerald-100">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-5">

              <span className="text-xs uppercase tracking-widest font-black text-emerald-700">

                Live Platform

              </span>

              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-emerald-950">

                One Dashboard.
                Complete Health Visibility.

              </h2>

              <p className="mt-4 text-slate-600 leading-relaxed">

                PALYA gives users one central environment
                to access livestock records, early detection,
                treatment monitoring, MRL and withdrawal
                information, alerts and veterinary workflows.

              </p>

              <div className="mt-6 space-y-3">

                {[
                  'Livestock health overview',
                  'Early detection and risk screening',
                  'Treatment and withdrawal monitoring',
                  'Veterinary case escalation',
                  'AMU and stewardship visibility'
                ].map(
                  (item) => (

                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm font-bold text-slate-700"
                    >

                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />

                      {item}

                    </div>

                  )
                )}

              </div>

              <button
                type="button"
                onClick={() =>
                  onNavigate('dashboard')
                }
                className="mt-8 px-6 py-3 rounded-xl bg-emerald-900 text-white font-black flex items-center gap-2 shadow-lg"
              >

                Open Live Dashboard

                <ArrowRight className="w-4 h-4" />

              </button>

            </div>

            {/* DASHBOARD MOCKUP */}

            <div className="lg:col-span-7">

              <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-2xl">

                <div className="h-11 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">

                  <span className="w-3 h-3 rounded-full bg-red-400" />

                  <span className="w-3 h-3 rounded-full bg-amber-400" />

                  <span className="w-3 h-3 rounded-full bg-emerald-400" />

                  <span className="ml-4 text-[10px] font-mono text-slate-400">

                    PALYA / Health Stewardship Dashboard

                  </span>

                </div>

                <div className="p-5 bg-slate-50">

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                    {[
                      ['Total Livestock', '124'],
                      ['Healthy', '103'],
                      ['Under Treatment', '12'],
                      ['Withdrawal', '09']
                    ].map(
                      ([label, value]) => (

                        <div
                          key={label}
                          className="bg-white rounded-xl p-3 border border-slate-200"
                        >

                          <p className="text-[9px] uppercase font-black text-slate-400">

                            {label}

                          </p>

                          <p className="text-xl font-black text-emerald-900 mt-1">

                            {value}

                          </p>

                        </div>

                      )
                    )}

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mt-4">

                    <div className="sm:col-span-3 bg-white border border-slate-200 rounded-xl p-4">

                      <p className="text-xs font-black text-slate-900">

                        Livestock Health Overview

                      </p>

                      <div className="mt-4 space-y-3">

                        {[
                          ['PL-1001', 'Cattle', 'Healthy'],
                          ['PL-1002', 'Buffalo', 'Under Treatment'],
                          ['PL-1003', 'Goat', 'Healthy']
                        ].map(
                          ([id, species, status]) => (

                            <div
                              key={id}
                              className="flex items-center justify-between border-b border-slate-100 pb-2"
                            >

                              <div>

                                <p className="text-[11px] font-black">

                                  {id}

                                </p>

                                <p className="text-[9px] text-slate-400">

                                  {species}

                                </p>

                              </div>

                              <span className={`text-[9px] font-black px-2 py-1 rounded-full ${
                                status === 'Healthy'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}>

                                {status}

                              </span>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                    <div className="sm:col-span-2 bg-emerald-950 rounded-xl p-4 text-white">

                      <p className="text-xs font-black">

                        Stewardship Snapshot

                      </p>

                      <div className="mt-4 space-y-3">

                        <div className="bg-white/10 rounded-lg p-3">

                          <p className="text-[9px] text-emerald-200">

                            Compliance Score

                          </p>

                          <p className="text-2xl font-black">

                            86%

                          </p>

                        </div>

                        <div className="bg-white/10 rounded-lg p-3">

                          <p className="text-[9px] text-emerald-200">

                            Active Alerts

                          </p>

                          <p className="text-2xl font-black">

                            04

                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          AI + EARLY DETECTION
      ===================================================== */}

      <section className="py-20 bg-white border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* EARLY DETECTION */}

            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-7 sm:p-8">

              <div className="w-12 h-12 rounded-xl bg-emerald-900 text-white flex items-center justify-center">

                <HeartPulse className="w-6 h-6" />

              </div>

              <span className="block mt-5 text-xs uppercase tracking-widest font-black text-emerald-700">

                Early Disease Detection

              </span>

              <h2 className="mt-2 text-2xl sm:text-3xl font-black text-emerald-950">

                Explainable Rule-Based Screening

              </h2>

              <p className="mt-4 text-sm text-slate-600 leading-relaxed">

                PALYA screens species-specific symptoms
                against structured clinical rules and
                provides a suspected condition, pattern
                match, risk level, matched symptoms and
                veterinary escalation recommendation.

              </p>

              <button
                type="button"
                onClick={() =>
                  onNavigate(
                    'early-detection'
                  )
                }
                className="mt-6 px-5 py-3 rounded-xl bg-white border border-emerald-200 text-emerald-900 text-sm font-black flex items-center gap-2"
              >

                Try Early Detection

                <ArrowRight className="w-4 h-4" />

              </button>

            </div>

            {/* AI ASSISTANT */}

            <div className="rounded-3xl bg-slate-950 p-7 sm:p-8 text-white">

              <div className="w-12 h-12 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center">

                <Bot className="w-6 h-6" />

              </div>

              <span className="block mt-5 text-xs uppercase tracking-widest font-black text-emerald-300">

                Digital Assistant

              </span>

              <h2 className="mt-2 text-2xl sm:text-3xl font-black">

                Voice-Enabled PALYA Assistant

              </h2>

              <p className="mt-4 text-sm text-slate-300 leading-relaxed">

                Farmers can interact with PALYA through
                conversational voice support for easier
                access to platform information and
                livestock-health workflows.

              </p>

              <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">

                <div className="flex gap-3">

                  <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">

                    <Bot className="w-4 h-4" />

                  </div>

                  <div>

                    <p className="text-xs font-black text-emerald-300">

                      PALYA Assistant

                    </p>

                    <p className="text-xs text-slate-300 mt-1">

                      Ask about records, withdrawal status,
                      livestock workflows or platform support.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          DIGITAL ANIMAL RECORD
      ===================================================== */}

      <section className="py-20 bg-[#f8fafc] border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-6">

              <span className="text-xs uppercase tracking-widest font-black text-emerald-700">

                Digital Health Passport

              </span>

              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-emerald-950">

                Every Animal.
                One Connected Health Record.

              </h2>

              <p className="mt-4 text-slate-600 leading-relaxed">

                Each registered animal maintains a structured
                digital record that brings identity, health,
                screening, treatment and withdrawal information
                together.

              </p>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">

                {[
                  'Unique animal identity',
                  'Species & breed information',
                  'Clinical screening history',
                  'Treatment records',
                  'Antimicrobial-use history',
                  'Withdrawal monitoring'
                ].map(
                  (item) => (

                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm font-bold text-slate-700"
                    >

                      <Check className="w-4 h-4 text-emerald-600" />

                      {item}

                    </div>

                  )
                )}

              </div>

            </div>

            <div className="lg:col-span-6">

              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6">

                <div className="flex items-center gap-4">

                  <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center">

                    <PawPrint className="w-9 h-9 text-emerald-800" />

                  </div>

                  <div>

                    <p className="text-xs uppercase tracking-widest font-black text-slate-400">

                      Animal ID

                    </p>

                    <h3 className="text-2xl font-black text-emerald-950">

                      PALYA-IND-001

                    </h3>

                    <p className="text-sm text-slate-500">

                      Cattle • Sahiwal

                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">

                  {[
                    ['Health Status', 'Healthy'],
                    ['Risk Level', 'Low'],
                    ['Withdrawal', 'Inactive'],
                    ['Last Review', 'Verified']
                  ].map(
                    ([label, value]) => (

                      <div
                        key={label}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200"
                      >

                        <p className="text-[10px] uppercase font-black text-slate-400">

                          {label}

                        </p>

                        <p className="text-sm font-black text-emerald-900 mt-1">

                          {value}

                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOD SAFETY
      ===================================================== */}

      <section
        id="food-safety"
        className="py-20 bg-emerald-950 text-white scroll-mt-24"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto">

            <ShieldCheck className="w-12 h-12 mx-auto text-emerald-300" />

            <span className="block mt-5 text-xs uppercase tracking-widest font-black text-emerald-300">

              Food Safety

            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl font-black">

              Treatment Doesn't End When Medicine Is Given

            </h2>

            <p className="mt-4 text-emerald-100 leading-relaxed">

              PALYA continues monitoring treatment-related
              withdrawal information so farmers and
              veterinarians remain aware when milk or meat
              withholding requirements are active.

            </p>

          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

              <Syringe className="w-7 h-7 text-emerald-300" />

              <h3 className="mt-4 text-lg font-black">

                Treatment Recorded

              </h3>

              <p className="mt-2 text-sm text-emerald-100">

                Medicine and treatment information becomes part
                of the animal's health history.

              </p>

            </div>

            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">

              <Activity className="w-7 h-7 text-emerald-300" />

              <h3 className="mt-4 text-lg font-black">

                Withdrawal Monitored

              </h3>

              <p className="mt-2 text-sm text-emerald-100">

                Active withdrawal status remains visible
                throughout the monitoring period.

              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

              <CheckCircle2 className="w-7 h-7 text-emerald-300" />

              <h3 className="mt-4 text-lg font-black">

                Clearance Tracked

              </h3>

              <p className="mt-2 text-sm text-emerald-100">

                Case workflow shows when applicable monitoring
                requirements have been completed.

              </p>

            </div>

          </div>

          <div className="mt-10 text-center">

            <button
              type="button"
              onClick={() =>
                onNavigate('mrl')
              }
              className="px-6 py-3 rounded-xl bg-white text-emerald-950 font-black inline-flex items-center gap-2"
            >

              View MRL & Withdrawal Module

              <ArrowRight className="w-4 h-4" />

            </button>

          </div>

        </div>

      </section>

      {/* =====================================================
          ONE HEALTH
      ===================================================== */}

      <section
        id="one-health"
        className="py-20 bg-white border-b border-slate-200 scroll-mt-24"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto">

            <span className="text-xs uppercase tracking-widest font-black text-emerald-700">

              One Health Approach

            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-emerald-950">

              Animal Health, Food Safety and Public Health Are Connected

            </h2>

            <p className="mt-4 text-slate-600">

              PALYA brings together stewardship workflows that
              connect healthier livestock management with safer
              food-production practices and responsible
              antimicrobial use.

            </p>

          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="text-center rounded-2xl bg-emerald-50 border border-emerald-100 p-7">

              <PawPrint className="w-9 h-9 text-emerald-700 mx-auto" />

              <h3 className="mt-4 text-lg font-black text-emerald-950">

                Animal Health

              </h3>

              <p className="mt-2 text-sm text-slate-600">

                Better records, earlier screening and connected
                veterinary care.

              </p>

            </div>

            <div className="text-center rounded-2xl bg-blue-50 border border-blue-100 p-7">

              <ShieldCheck className="w-9 h-9 text-blue-700 mx-auto" />

              <h3 className="mt-4 text-lg font-black text-slate-900">

                Food Safety

              </h3>

              <p className="mt-2 text-sm text-slate-600">

                Withdrawal visibility and structured treatment
                monitoring.

              </p>

            </div>

            <div className="text-center rounded-2xl bg-purple-50 border border-purple-100 p-7">

              <Users className="w-9 h-9 text-purple-700 mx-auto" />

              <h3 className="mt-4 text-lg font-black text-slate-900">

                Community Health

              </h3>

              <p className="mt-2 text-sm text-slate-600">

                Responsible antimicrobial stewardship supports
                wider One Health goals.

              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          WHY PALYA
      ===================================================== */}

      <section className="py-20 bg-slate-50 border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-5">

              <span className="text-xs uppercase tracking-widest font-black text-emerald-700">

                Why PALYA?

              </span>

              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-emerald-950">

                Designed Around the Complete Livestock Care Journey

              </h2>

              <p className="mt-4 text-slate-600 leading-relaxed">

                Instead of treating livestock records,
                veterinary actions, antimicrobial use and
                food-safety monitoring as separate processes,
                PALYA connects them into a single workflow.

              </p>

            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">

              {[
                {
                  icon: ClipboardCheck,
                  title:
                    'Structured Records',
                  text:
                    'Animal histories remain organized and accessible.'
                },

                {
                  icon: HeartPulse,
                  title:
                    'Early Screening',
                  text:
                    'Explainable species-specific symptom screening.'
                },

                {
                  icon: Stethoscope,
                  title:
                    'Vet Verification',
                  text:
                    'Clinical escalation with verified visit evidence.'
                },

                {
                  icon: Activity,
                  title:
                    'AMU Stewardship',
                  text:
                    'Treatment and antimicrobial-use visibility.'
                },

                {
                  icon: Bell,
                  title:
                    'Withdrawal Awareness',
                  text:
                    'Active withdrawal monitoring remains visible.'
                },

                {
                  icon: ShieldCheck,
                  title:
                    'Food Safety',
                  text:
                    'Treatment workflow extends toward clearance.'
                }
              ].map(
                (feature) => {

                  const Icon =
                    feature.icon;

                  return (

                    <div
                      key={feature.title}
                      className="bg-white rounded-2xl p-5 border border-slate-200"
                    >

                      <Icon className="w-6 h-6 text-emerald-700" />

                      <h3 className="mt-3 font-black text-slate-900">

                        {feature.title}

                      </h3>

                      <p className="mt-1 text-xs text-slate-600">

                        {feature.text}

                      </p>

                    </div>

                  );
                }
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="py-20 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <ShieldCheck className="w-12 h-12 mx-auto text-emerald-300" />

          <h2 className="mt-6 text-3xl sm:text-5xl font-black tracking-tight">

            Better Livestock Decisions Start With Better Information.

          </h2>

          <p className="mt-5 text-emerald-100 max-w-2xl mx-auto">

            Bring animal records, preventive screening,
            veterinary workflows, antimicrobial stewardship and
            withdrawal monitoring into one connected platform.

          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">

            <button
              type="button"
              onClick={() =>
                onNavigate('dashboard')
              }
              className="px-7 py-3.5 rounded-xl bg-white text-emerald-950 font-black shadow-lg flex items-center justify-center gap-2"
            >

              Launch PALYA

              <ArrowRight className="w-5 h-5" />

            </button>

            <button
              type="button"
              onClick={() =>
                onNavigate('auth')
              }
              className="px-7 py-3.5 rounded-xl border border-emerald-400 text-white font-black hover:bg-white/10"
            >

              Sign In

            </button>

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-[#021e0e] text-white border-t border-emerald-900">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* BRAND */}

            <div className="md:col-span-2">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 bg-white rounded-xl overflow-hidden">

                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_zloVXKb2vfI-mUu86cZTPV6qHLTQqS5lsj8OO_Rtqsp5LyvrIl84fJql9xk7CDoJr0OE6YENTyk3nDVDLRa-NjieETrgRrQlGPnmUnhKaWurmPhu2AxVqUTtgHzDfZpdGBaS2JQkKXkF_jCUTezbFQ04mqGlZP550uEycw4OTrTUGRWp0gV3H2enfWXPsNLYM2crSN5YFo6Fx56s6AqEvmJ6wkbwOhjjifP5bygglRNjjmoMavTqeQVIpt53Tf_mRuY"
                    alt="PALYA"
                    className="w-full h-full object-contain"
                  />

                </div>

                <div>

                  <p className="text-xl font-black">

                    PALYA

                  </p>

                  <p className="text-[10px] uppercase tracking-widest font-black text-emerald-300">

                    Health Stewardship

                  </p>

                </div>

              </div>

              <p className="mt-5 text-sm text-emerald-100 max-w-md leading-relaxed">

                Digital livestock health stewardship connecting
                farmers, veterinarians, treatment monitoring and
                food-safety awareness.

              </p>

            </div>

            {/* PLATFORM */}

            <div>

              <p className="text-sm font-black">

                Platform

              </p>

              <div className="mt-4 space-y-3 text-xs text-emerald-200">

                <button
                  onClick={() =>
                    onNavigate('dashboard')
                  }
                  className="block hover:text-white"
                >
                  Dashboard
                </button>

                <button
                  onClick={() =>
                    onNavigate(
                      'early-detection'
                    )
                  }
                  className="block hover:text-white"
                >
                  Early Detection
                </button>

                <button
                  onClick={() =>
                    onNavigate('mrl')
                  }
                  className="block hover:text-white"
                >
                  MRL & Withdrawal
                </button>

              </div>

            </div>

            {/* ACCESS */}

            <div>

              <p className="text-sm font-black">

                Access

              </p>

              <div className="mt-4 space-y-3 text-xs text-emerald-200">

                <button
                  onClick={() =>
                    onNavigate('auth')
                  }
                  className="block hover:text-white"
                >
                  Sign In
                </button>

                <button
                  onClick={() =>
                    onNavigate('dashboard')
                  }
                  className="block hover:text-white"
                >
                  Launch Platform
                </button>

              </div>

            </div>

          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">

            <p className="text-[11px] text-emerald-300">

              © 2026 PALYA Health Stewardship Platform

            </p>

            <p className="text-[11px] text-emerald-300">

              Team Quantum Forge

            </p>

          </div>

        </div>

      </footer>

    </div>
  );
};