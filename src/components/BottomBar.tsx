/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { VisualStyle, VISUAL_STYLES } from '../theme/tokens';

interface BottomBarProps {
  primaryLabel: string;
  onPrimaryClick: () => void;
  primaryDisabled?: boolean;
  primaryTestId?: string;
  primaryVariant?: 'default' | 'danger' | 'success';
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
  secondaryTestId?: string;
  hint?: string;
  isBusy?: boolean;
  visualStyle?: VisualStyle;
  isLightMode: boolean;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  primaryLabel,
  onPrimaryClick,
  primaryDisabled = false,
  primaryTestId,
  primaryVariant = 'default',
  secondaryLabel,
  onSecondaryClick,
  secondaryTestId,
  hint,
  isBusy = false,
  visualStyle = 'cozy',
  isLightMode,
}) => {
  const style = VISUAL_STYLES[visualStyle];

  let primaryColors = `${style.primaryBg} ${style.primaryHover} ${style.primaryText}`;
  if (primaryVariant === 'danger') {
    primaryColors = 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold';
  } else if (primaryVariant === 'success') {
    primaryColors = 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold';
  }

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 z-30 flex flex-col items-center justify-end px-4 pt-3 pb-[calc(14px+var(--sab))] border-t backdrop-blur-md transition-colors ${
        isLightMode
          ? 'bg-white/95 border-neutral-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]'
          : 'bg-neutral-950/95 border-neutral-800 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]'
      }`}
    >
      <div className="w-full max-w-[430px] flex flex-col gap-2">
        {hint && (
          <p className="text-center text-[13px] font-medium text-neutral-500 dark:text-neutral-400 px-2 leading-tight">
            {hint}
          </p>
        )}

        <div className="w-full flex items-center gap-2">
          {secondaryLabel && onSecondaryClick && (
            <button
              type="button"
              data-testid={secondaryTestId}
              onClick={onSecondaryClick}
              disabled={isBusy}
              className={`h-12 px-4 rounded-2xl text-[14px] font-semibold transition-all duration-150 active:scale-95 border shrink-0 ${
                isLightMode
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
              }`}
            >
              {secondaryLabel}
            </button>
          )}

          <button
            type="button"
            data-testid={primaryTestId}
            onClick={onPrimaryClick}
            disabled={primaryDisabled || isBusy}
            className={`flex-1 h-12 px-5 rounded-2xl text-[15px] flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${primaryColors}`}
          >
            {isBusy ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Загрузка…</span>
              </>
            ) : (
              <span>{primaryLabel}</span>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
};
