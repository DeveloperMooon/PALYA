import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export type LaunchStage = 'splash' | 'ready';

interface LaunchScreenTransitionProps {
  stage: LaunchStage;
  onAdvanceToReady: () => void;
  onSkip: () => void;
  // Backward compatibility in case passed
  onAdvanceToSkeleton?: () => void;
}

export const LaunchScreenTransition: React.FC<LaunchScreenTransitionProps> = ({
  stage,
  onAdvanceToReady,
  onSkip
}) => {
  // Timing sequence: Display Splash for ~1.8 seconds, then transition directly into the main app
  useEffect(() => {
    if (stage === 'splash') {
      const timer = setTimeout(() => {
        onAdvanceToReady();
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [stage, onAdvanceToReady]);

  return (
    <AnimatePresence>
      {stage === 'splash' && (
        <motion.div
          key="stage-splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 bg-white flex flex-col justify-between items-center px-6 py-10 select-none overflow-hidden"
          id="launch-splash-screen"
        >
          {/* Top Skip Button */}
          <div className="w-full flex justify-end">
            <button
              onClick={onSkip}
              id="btn-skip-launch-screen"
              className="text-xs font-semibold text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer"
            >
              <span>Skip</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Center Brand Area */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            {/* Logo Emblem Container */}
            <div className="relative mb-6">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white border border-slate-100 shadow-xl p-3 flex items-center justify-center relative z-10">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBalydRg2eY901DQK2BcFn0HHpPgj8oC_5_PwT4aicpLUc9fWMGzxQC1hlsTalrf3WDIr_KTdjwRrwHhq4bWUwc9TkkAR4BXck3D5lBKgU_aDdkHiLcZ3pBdWQ9TwFBGJ3u0VUBpynag1XIcOROJjPXrzhdffA3XPuDihVLnBlh9NHNTMWRKpq2Cf2zJ9jUcccRHbF6_vj1zEf8f9bV-vtEdPINyErirs4wpgY6II3UIKTjQVt2fHRiRg"
                  alt="PALYA Animal Protection & Health"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Subtle animated halo */}
              <div className="absolute -inset-2 rounded-3xl bg-emerald-500/10 blur-xl animate-pulse pointer-events-none" />
            </div>

            {/* Brand Title */}
            <h1 className="text-4xl sm:text-5xl font-black text-[#1A2B4C] tracking-wider mb-2 font-display">
              PALYA
            </h1>

            {/* Brand Subtitle / Tagline */}
            <p className="text-xs sm:text-sm font-extrabold text-[#2E6F40] tracking-widest uppercase">
              Agricultural Protection & Health
            </p>

            {/* Loading Indicator Pill */}
            <div className="mt-8 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/80">
              <div className="w-2 h-2 rounded-full bg-[#2E6F40] animate-ping" />
              <span className="text-[11px] font-semibold text-slate-500 tracking-wide">
                Initializing Health Stewardship Engine...
              </span>
            </div>
          </motion.div>

          {/* Bottom Trust Indicators (Paytm style) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center text-center space-y-1"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E6F40]">
              <ShieldCheck className="w-4 h-4 text-[#2E6F40]" />
              <span>Verified Agricultural & Health Stewardship Network</span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">
              Trusted by Certified Veterinarians & Farm Managers
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
