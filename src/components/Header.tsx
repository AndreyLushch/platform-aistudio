/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Settings, Plus } from 'lucide-react';
import { PlatformView } from '../types';
import { VisualStyle, VISUAL_STYLES } from '../theme/tokens';
import { TEXTS } from '../texts';

interface HeaderProps {
  view: PlatformView;
  onOpenTopup: () => void;
  onOpenSettings: () => void;
  visualStyle: VisualStyle;
  customTitle?: string;
  isLightMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  view,
  onOpenTopup,
  onOpenSettings,
  visualStyle,
  customTitle,
  isLightMode,
}) => {
  const style = VISUAL_STYLES[visualStyle];
  const chatTitle = view.chat.title || 'Комната чата';

  return (
    <header
      className={`w-full px-4 pt-3 pb-2.5 flex items-center justify-between border-b transition-colors z-20 ${
        isLightMode
          ? `bg-white/95 backdrop-blur-md ${style.headerBorderLight} text-neutral-900`
          : `bg-neutral-950/95 backdrop-blur-md ${style.headerBorderDark} text-white`
      }`}
    >
      {/* Left: Branding & Group Info */}
      <div className="flex flex-col min-w-0 pr-2">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-[17px] tracking-tight truncate">
            {customTitle || TEXTS.app.title}
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        </div>
        <p className="text-[13px] text-neutral-500 dark:text-neutral-400 truncate max-w-[170px]">
          {chatTitle}
        </p>
      </div>

      {/* Right: Balance Pill & Settings Button */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Token Balance Button */}
        <button
          type="button"
          data-testid="platform-wallet-balance"
          onClick={onOpenTopup}
          aria-label={`${TEXTS.header.balanceAria}: ${view.wallet.balanceTokens} жетонов. Нажмите для пополнения`}
          className={`h-11 px-3 rounded-full flex items-center gap-1.5 font-semibold text-[14px] transition-all duration-150 active:scale-95 border ${
            isLightMode
              ? 'bg-amber-50/90 text-amber-900 border-amber-200/80 hover:bg-amber-100 shadow-sm'
              : 'bg-amber-950/40 text-amber-200 border-amber-800/60 hover:bg-amber-950/70 shadow-sm'
          }`}
        >
          <span className="text-[16px] leading-none" aria-hidden="true">
            {TEXTS.app.tokensSymbol}
          </span>
          <span className="tabular-nums font-bold tracking-tight">{view.wallet.balanceTokens}</span>
          <span
            className={`w-4 h-4 rounded-full flex items-center justify-center text-[11px] font-black ${
              isLightMode ? 'bg-amber-200 text-amber-800' : 'bg-amber-800/80 text-amber-100'
            }`}
          >
            <Plus className="w-3 h-3 stroke-[3]" />
          </span>
        </button>

        {/* Settings Gear Button */}
        <button
          type="button"
          data-testid="platform-settings-open"
          onClick={onOpenSettings}
          aria-label={TEXTS.header.settingsAria}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150 active:scale-95 border ${
            isLightMode
              ? 'bg-neutral-100/90 text-neutral-700 hover:bg-neutral-200/80 border-neutral-200/80'
              : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border-neutral-800'
          }`}
        >
          <Settings className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
        </button>
      </div>
    </header>
  );
};
