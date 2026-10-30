/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Send, Smartphone } from 'lucide-react';
import { TEXTS } from '../texts';

interface NoTelegramScreenProps {
  isLightMode: boolean;
}

export const NoTelegramScreen: React.FC<NoTelegramScreenProps> = ({ isLightMode }) => {
  return (
    <div
      data-testid="platform-screen-no-telegram"
      className="flex-1 w-full flex flex-col items-center justify-center p-6 text-center select-none"
    >
      <div className="w-20 h-20 rounded-3xl bg-sky-500/15 text-sky-500 flex items-center justify-center mb-6 shadow-md border border-sky-500/20">
        <Send className="w-10 h-10 ml-0.5" />
      </div>

      <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
        {TEXTS.noTelegram.title}
      </h1>

      <p className="text-[14px] text-neutral-600 dark:text-neutral-400 mt-3 max-w-sm leading-relaxed">
        {TEXTS.noTelegram.description}
      </p>

      <div
        className={`w-full max-w-sm mt-6 p-4 rounded-2xl border text-left flex items-start gap-3 ${
          isLightMode
            ? 'bg-sky-50/60 border-sky-200 text-sky-950'
            : 'bg-sky-950/30 border-sky-800 text-sky-200'
        }`}
      >
        <Smartphone className="w-5 h-5 shrink-0 mt-0.5 text-sky-600 dark:text-sky-400" />
        <span className="text-[13.5px] leading-snug">
          {TEXTS.noTelegram.instruction}
        </span>
      </div>
    </div>
  );
};
