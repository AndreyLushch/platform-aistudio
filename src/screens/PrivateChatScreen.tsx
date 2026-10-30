/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users2, X } from 'lucide-react';
import { TEXTS } from '../texts';

interface PrivateChatScreenProps {
  onClose?: () => void;
  isLightMode: boolean;
}

export const PrivateChatScreen: React.FC<PrivateChatScreenProps> = ({ onClose, isLightMode }) => {
  return (
    <div
      data-testid="platform-screen-private"
      className="flex-1 w-full flex flex-col items-center justify-between p-6 select-none"
    >
      <div className="w-full flex flex-col items-center text-center mt-4">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 shadow-sm border border-amber-500/20">
          <Users2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
          {TEXTS.privateChat.title}
        </h1>

        <p className="text-[14px] text-neutral-600 dark:text-neutral-400 mt-2 max-w-sm">
          {TEXTS.privateChat.description}
        </p>

        {/* 3 Step Instructions */}
        <div className="w-full max-w-sm flex flex-col gap-3 mt-6 text-left">
          {TEXTS.privateChat.steps.map((step) => (
            <div
              key={step.num}
              className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                isLightMode
                  ? 'bg-white border-neutral-200/90 shadow-xs'
                  : 'bg-neutral-900 border-neutral-800'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-[14px] flex items-center justify-center shrink-0">
                {step.num}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[14.5px] text-neutral-900 dark:text-neutral-100">
                  {step.title}
                </span>
                <span className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {step.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm mt-8 mb-4">
        <button
          type="button"
          onClick={() => {
            if (onClose) {
              onClose();
            } else {
              const tg = (window as unknown as { Telegram?: { WebApp?: { close?: () => void } } }).Telegram?.WebApp;
              tg?.close?.();
            }
          }}
          className={`w-full h-12 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 border transition-all ${
            isLightMode
              ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'
              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
          }`}
        >
          <X className="w-4 h-4" />
          <span>{TEXTS.privateChat.closeBtn}</span>
        </button>
      </div>
    </div>
  );
};
