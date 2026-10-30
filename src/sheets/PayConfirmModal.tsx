/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Crown } from 'lucide-react';
import { TEXTS } from '../texts';

interface PayConfirmModalProps {
  isOpen: boolean;
  tokens: number;
  gameTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLightMode: boolean;
}

export const PayConfirmModal: React.FC<PayConfirmModalProps> = ({
  isOpen,
  tokens,
  gameTitle,
  onConfirm,
  onCancel,
  isLightMode,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="pay-title"
      aria-describedby="pay-desc"
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
          <Crown className="w-7 h-7 fill-amber-500/20" />
        </div>

        <h3 id="pay-title" className="font-extrabold text-[18px] tracking-tight">
          {TEXTS.modals.payConfirm.title}
        </h3>

        <div className="my-3 px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 w-full flex flex-col items-center">
          <span className="text-[13px] text-amber-800 dark:text-amber-300 font-medium">
            Игра «{gameTitle}»
          </span>
          <span className="text-2xl font-black text-amber-900 dark:text-amber-200 mt-0.5">
            {tokens > 0 ? `🪙 ${tokens} жетонов` : 'Бесплатно (0 жетонов)'}
          </span>
        </div>

        <p id="pay-desc" className="text-[13.5px] text-neutral-600 dark:text-neutral-400">
          {TEXTS.modals.payConfirm.description(tokens)}
        </p>

        <div className="w-full flex flex-col gap-2.5 mt-5">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full h-12 rounded-2xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-[14.5px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>{TEXTS.modals.payConfirm.confirm}</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className={`w-full h-12 rounded-2xl font-bold text-[14.5px] flex items-center justify-center gap-2 border transition-all ${
              isLightMode
                ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
            }`}
          >
            <span>{TEXTS.modals.payConfirm.cancel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
