/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { TEXTS } from '../texts';

interface CancelGameModalProps {
  isOpen: boolean;
  tokens: number;
  onConfirm: () => void;
  onCancel: () => void;
  isLightMode: boolean;
}

export const CancelGameModal: React.FC<CancelGameModalProps> = ({
  isOpen,
  tokens,
  onConfirm,
  onCancel,
  isLightMode,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="cancel-game-title"
      aria-describedby="cancel-game-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs transition-opacity duration-200"
    >
      <div
        className={`w-full max-w-[380px] rounded-3xl p-6 flex flex-col items-center text-center border shadow-2xl transition-all ${
          isLightMode
            ? 'bg-white border-neutral-200 text-neutral-900'
            : 'bg-neutral-900 border-neutral-800 text-white'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
          <RotateCcw className="w-7 h-7" />
        </div>

        <h3 id="cancel-game-title" className="font-extrabold text-[18px] tracking-tight">
          {TEXTS.modals.cancelGameConfirm.title}
        </h3>
        <p id="cancel-game-desc" className="text-[13.5px] text-neutral-600 dark:text-neutral-400 mt-2">
          {TEXTS.modals.cancelGameConfirm.description(tokens)}
        </p>

        <div className="w-full flex flex-col gap-2.5 mt-5">
          <button
            type="button"
            data-testid="platform-btn-cancel-game"
            onClick={onConfirm}
            className="w-full h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-[14.5px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md"
          >
            <span>{TEXTS.modals.cancelGameConfirm.confirm}</span>
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
            <span>{TEXTS.modals.cancelGameConfirm.cancel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
