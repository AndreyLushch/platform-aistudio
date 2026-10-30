/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DoorOpen, RefreshCw, Play } from 'lucide-react';
import { TEXTS } from '../texts';

interface ReentryModalProps {
  isOpen: boolean;
  onDecision: (decision: 'resume' | 'new') => void;
  isLightMode: boolean;
}

export const ReentryModal: React.FC<ReentryModalProps> = ({
  isOpen,
  onDecision,
  isLightMode,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="reentry-title"
      aria-describedby="reentry-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs transition-opacity duration-200"
    >
      <div
        className={`w-full max-w-[380px] rounded-3xl p-6 flex flex-col items-center text-center border shadow-2xl transition-all ${
          isLightMode
            ? 'bg-white border-neutral-200 text-neutral-900'
            : 'bg-neutral-900 border-neutral-800 text-white'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
          <DoorOpen className="w-7 h-7" />
        </div>

        <h3 id="reentry-title" className="font-extrabold text-[18px] tracking-tight">
          {TEXTS.modals.reentry.title}
        </h3>
        <p id="reentry-desc" className="text-[13.5px] text-neutral-600 dark:text-neutral-400 mt-2">
          {TEXTS.modals.reentry.description}
        </p>

        <div className="w-full flex flex-col gap-2.5 mt-5">
          <button
            type="button"
            onClick={() => onDecision('resume')}
            className="w-full h-12 rounded-2xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-[14.5px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{TEXTS.modals.reentry.resume}</span>
          </button>

          <button
            type="button"
            onClick={() => onDecision('new')}
            className={`w-full h-12 rounded-2xl font-bold text-[14.5px] flex items-center justify-center gap-2 border transition-all ${
              isLightMode
                ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>{TEXTS.modals.reentry.newGame}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
