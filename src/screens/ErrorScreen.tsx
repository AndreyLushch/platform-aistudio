/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { TEXTS } from '../texts';

interface ErrorScreenProps {
  error: { code: string; message: string };
  onRetry: () => void;
  isLightMode: boolean;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onRetry, isLightMode }) => {
  const isMaintenance = error.code === 'MAINTENANCE';

  return (
    <div
      data-testid="platform-screen-error"
      className="flex-1 w-full flex flex-col items-center justify-between p-6 select-none"
    >
      <div className="w-full flex flex-col items-center text-center mt-10">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5 shadow-sm border border-rose-500/20">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
          {isMaintenance ? 'Технические работы' : 'Ошибка соединения'}
        </h1>

        <p className="text-[14px] text-neutral-600 dark:text-neutral-400 mt-2 max-w-sm">
          {error.message || TEXTS.errors.UNKNOWN}
        </p>

        <div
          className={`mt-6 px-3.5 py-1.5 rounded-xl text-[13px] font-mono border ${
            isLightMode
              ? 'bg-neutral-100 border-neutral-200 text-neutral-600'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400'
          }`}
        >
          Код ошибки: {error.code}
        </div>
      </div>

      <div className="w-full max-w-sm mb-6">
        <button
          type="button"
          onClick={onRetry}
          className="w-full h-12 rounded-2xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{TEXTS.errors.retry}</span>
        </button>
      </div>
    </div>
  );
};
