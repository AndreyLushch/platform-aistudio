/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bell, ExternalLink, CheckCheck, Loader2 } from 'lucide-react';
import { TEXTS } from '../texts';

interface SubscribeScreenProps {
  channelUsername: string;
  isBusy: boolean;
  onOpenChannel: () => void;
  onRecheck: () => void;
  isLightMode: boolean;
}

export const SubscribeScreen: React.FC<SubscribeScreenProps> = ({
  channelUsername,
  isBusy,
  onOpenChannel,
  onRecheck,
  isLightMode,
}) => {
  return (
    <div
      data-testid="platform-screen-subscribe"
      className="flex-1 w-full flex flex-col items-center justify-between p-6 select-none"
    >
      <div className="w-full flex flex-col items-center text-center mt-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 shadow-sm border border-amber-500/20">
          <Bell className="w-10 h-10 animate-bounce" />
        </div>

        <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
          {TEXTS.subscribe.title}
        </h1>

        <p className="text-[14px] text-neutral-600 dark:text-neutral-400 mt-2 max-w-sm leading-relaxed">
          {TEXTS.subscribe.description}
        </p>

        {/* Channel Pill */}
        <div
          className={`mt-6 px-4 py-3 rounded-2xl border flex items-center gap-2 font-mono font-bold text-[15px] ${
            isLightMode
              ? 'bg-neutral-50 border-neutral-200 text-neutral-900'
              : 'bg-neutral-900 border-neutral-800 text-white'
          }`}
        >
          <span className="text-amber-500">@</span>
          <span>{channelUsername}</span>
        </div>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3 mb-6">
        <button
          type="button"
          onClick={onOpenChannel}
          className="w-full h-12 rounded-2xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
        >
          <ExternalLink className="w-4 h-4" />
          <span>{TEXTS.subscribe.openChannelBtn}</span>
        </button>

        <button
          type="button"
          onClick={onRecheck}
          disabled={isBusy}
          className={`w-full h-12 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 border transition-all ${
            isLightMode
              ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'
              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
          }`}
        >
          {isBusy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              <span>{TEXTS.subscribe.checking}</span>
            </>
          ) : (
            <>
              <CheckCheck className="w-4 h-4 text-emerald-500" />
              <span>{TEXTS.subscribe.recheckBtn}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
