/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Moon, Sun, Smartphone, Vibrate, Palette } from 'lucide-react';
import { PlatformView } from '../types';
import { TEXTS } from '../texts';
import { VisualStyle, VISUAL_STYLES } from '../theme/tokens';
import { triggerHaptic } from '../utils/haptics';

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  view: PlatformView;
  onSetTheme: (theme: 'telegram' | 'light' | 'dark') => void;
  onToggleHaptics: (enabled: boolean) => void;
  visualStyle: VisualStyle;
  onSetVisualStyle: (style: VisualStyle) => void;
  isLightMode: boolean;
}

export const SettingsSheet: React.FC<SettingsSheetProps> = ({
  isOpen,
  onClose,
  view,
  onSetTheme,
  onToggleHaptics,
  visualStyle,
  onSetVisualStyle,
  isLightMode,
}) => {
  if (!isOpen) return null;

  const currentTheme = view.prefs.theme;
  const haptics = view.prefs.haptics;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-sheet-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
    >
      <div
        className={`w-full max-w-[430px] rounded-t-3xl p-5 pb-[calc(20px+var(--sab))] flex flex-col border-t transition-colors shadow-2xl ${
          isLightMode
            ? 'bg-white border-neutral-200 text-neutral-900'
            : 'bg-neutral-900 border-neutral-800 text-white'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60 dark:border-neutral-800">
          <h2 id="settings-sheet-title" className="font-extrabold text-[17px] tracking-tight">
            {TEXTS.settings.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-5 py-4">
          {/* Theme Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-[13.5px] font-bold text-neutral-700 dark:text-neutral-300">
              {TEXTS.settings.themeLabel}
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  onSetTheme('telegram');
                  triggerHaptic('light', haptics);
                }}
                className={`h-11 px-2 rounded-2xl text-[13px] font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  currentTheme === 'telegram'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : isLightMode
                    ? 'bg-neutral-100 text-neutral-800 border-neutral-200 hover:bg-neutral-200'
                    : 'bg-neutral-800 text-neutral-200 border-neutral-700 hover:bg-neutral-700'
                }`}
              >
                <Smartphone className="w-4 h-4 shrink-0" />
                <span className="truncate">{TEXTS.settings.themeTelegram}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSetTheme('light');
                  triggerHaptic('light', haptics);
                }}
                className={`h-11 px-2 rounded-2xl text-[13px] font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  currentTheme === 'light'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : isLightMode
                    ? 'bg-neutral-100 text-neutral-800 border-neutral-200 hover:bg-neutral-200'
                    : 'bg-neutral-800 text-neutral-200 border-neutral-700 hover:bg-neutral-700'
                }`}
              >
                <Sun className="w-4 h-4 shrink-0" />
                <span className="truncate">{TEXTS.settings.themeLight}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSetTheme('dark');
                  triggerHaptic('light', haptics);
                }}
                className={`h-11 px-2 rounded-2xl text-[13px] font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  currentTheme === 'dark'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : isLightMode
                    ? 'bg-neutral-100 text-neutral-800 border-neutral-200 hover:bg-neutral-200'
                    : 'bg-neutral-800 text-neutral-200 border-neutral-700 hover:bg-neutral-700'
                }`}
              >
                <Moon className="w-4 h-4 shrink-0" />
                <span className="truncate">{TEXTS.settings.themeDark}</span>
              </button>
            </div>
          </div>

          {/* Haptics Switch */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Vibrate className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-neutral-900 dark:text-neutral-100">
                  {TEXTS.settings.hapticsLabel}
                </span>
                <span className="text-[13px] text-neutral-500 dark:text-neutral-400">
                  {TEXTS.settings.hapticsDesc}
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={haptics}
              onClick={() => {
                const nextVal = !haptics;
                onToggleHaptics(nextVal);
                if (nextVal) triggerHaptic('medium', true);
              }}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 ${
                haptics ? 'bg-amber-600' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                  haptics ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Visual Style Variant (3 variants as specified in Section 7) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-500" />
              <span className="text-[13.5px] font-bold text-neutral-700 dark:text-neutral-300">
                {TEXTS.settings.styleLabel}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {(Object.keys(VISUAL_STYLES) as VisualStyle[]).map((styleKey) => {
                const item = VISUAL_STYLES[styleKey];
                const isSelected = visualStyle === styleKey;
                return (
                  <button
                    key={styleKey}
                    type="button"
                    onClick={() => {
                      onSetVisualStyle(styleKey);
                      triggerHaptic('light', haptics);
                    }}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between text-left border transition-all ${
                      isSelected
                        ? isLightMode
                          ? 'bg-amber-50/80 border-amber-400 shadow-xs'
                          : 'bg-amber-950/30 border-amber-600 shadow-xs'
                        : isLightMode
                        ? 'bg-white border-neutral-200 hover:bg-neutral-50'
                        : 'bg-neutral-800/40 border-neutral-800 hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-[14px] text-neutral-900 dark:text-neutral-100">
                        {item.name}
                      </span>
                      <span className="text-[13px] text-neutral-500 dark:text-neutral-400">
                        {item.description}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full h-12 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[14.5px] transition-colors"
        >
          {TEXTS.settings.closeBtn}
        </button>
      </div>
    </div>
  );
};
