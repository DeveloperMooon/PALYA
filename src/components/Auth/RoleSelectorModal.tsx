import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { AppRole } from '../../types';
import { ROLE_OPTIONS } from '../../services/authService';

interface RoleSelectorModalProps {
  isOpen: boolean;
  selectedRole?: AppRole;
  onSelectRole: (role: AppRole) => void;
  onClose: () => void;
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({
  isOpen,
  selectedRole,
  onSelectRole,
  onClose
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal / Bottom Sheet */}
          <motion.div
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative z-10 w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="role-modal-title"
          >
            {/* Sheet Handle (mobile) */}
            <div className="sm:hidden w-full flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 rounded-full bg-slate-300" />
            </div>

            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
              <div>
                <h3 id="role-modal-title" className="text-lg font-bold text-[#1A2B4C]">
                  Select your role
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose your function within the livestock health network
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close role selector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role List */}
            <div className="p-4 overflow-y-auto space-y-2">
              {ROLE_OPTIONS.map((opt) => {
                const isSelected = selectedRole === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onSelectRole(opt.id);
                      onClose();
                    }}
                    className={`w-full text-left px-4 py-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-[#16A34A] bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold ${
                            isSelected ? 'text-[#16A34A]' : 'text-[#1A2B4C]'
                          }`}
                        >
                          {opt.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{opt.description}</p>
                    </div>

                    {/* Radio Button Indicator */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'border-[#16A34A] bg-[#16A34A]'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Safe Area Padding */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Selected role will configure your permissions</span>
              <button
                type="button"
                onClick={onClose}
                className="font-bold text-[#16A34A] hover:underline"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
