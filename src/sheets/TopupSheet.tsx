/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { PlatformView } from '../types';
import { TEXTS } from '../texts';
import { triggerHaptic } from '../utils/haptics';

interface TopupSheetProps {
  isOpen: boolean;
  onClose: () => void;
  view: PlatformView;
  onBuyPackage: (packageId: string) => void;
  isLightMode: boolean;
}

type SimulationState = 'idle' | 'opening' | 'success' | 'cancelled' | 'error' | 'not_in_telegram';

export const TopupSheet: React.FC<TopupSheetProps> = ({
  isOpen,
  onClose,
  view,
  onBuyPackage,
  isLightMode,
}) => {
  const [simulationState, setSimulationState] = useState<SimulationState>('idle');
  const [selectedTokens, setSelectedTokens] = useState<number>(0);

  if (!isOpen) return null;

  const handlePurchase = (pkgId: string, tokens: number) => {
    // If running outside Telegram, show notice
    if (view.context === 'no_telegram') {
      setSimulationState('not_in_telegram');
      return;
    }

    setSelectedTokens(tokens);
    setSimulationState('opening');
    triggerHaptic('light', view.prefs.haptics);

    // Simulate Telegram Stars flow
    setTimeout(() => {
      onBuyPackage(pkgId);
      setSimulationState('success');
      triggerHaptic('success', view.prefs.haptics);
      setTimeout(() => {
        setSimulationState('idle');
      }, 2500);
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="topup-sheet-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
    >
      <div
        className={`w-full max-w-[430px] rounded-t-3xl p-5 pb-[calc(20px+var(--sab))] flex flex-col border-t transition-colors shadow-2xl ${
          isLightMode
            ? 'bg-white border-neutral-200 text-neutral-900'
            : 'bg-neutral-900 border-neutral-800 text-white'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪙</span>
            <h2 id="topup-sheet-title" className="font-extrabold text-[17px] tracking-tight">
              {TEXTS.topup.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={TEXTS.topup.closeBtn}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Banner */}
        <div
          className={`my-4 p-4 rounded-2xl flex items-center justify-between border ${
            isLightMode
              ? 'bg-amber-50/70 border-amber-200/80 text-amber-950'
              : 'bg-amber-950/30 border-amber-800/60 text-amber-200'
          }`}
        >
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-amber-800/80 dark:text-amber-300/80">
              {TEXTS.topup.currentBalance}
            </span>
            <span className="text-2xl font-black tabular-nums flex items-center gap-1 mt-0.5">
              <span>{TEXTS.app.tokensSymbol}</span>
              <span>{view.wallet.balanceTokens}</span>
              <span className="text-[14px] font-semibold text-amber-700 dark:text-amber-400">
                жетонов
              </span>
            </span>
          </div>
          <p className="text-[13px] text-right font-medium text-amber-800/80 dark:text-amber-300/80 max-w-[150px]">
            {TEXTS.topup.starsInfo}
          </p>
        </div>

        {/* Simulation Feedback Overlays */}
        {simulationState === 'opening' && (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <p className="font-bold text-[15px]">{TEXTS.topup.openingPayment}</p>
          </div>
        )}

        {simulationState === 'success' && (
          <div className="py-6 flex flex-col items-center justify-center text-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
            <p className="font-bold text-[16px]">{TEXTS.topup.successMsg(selectedTokens)}</p>
          </div>
        )}

        {simulationState === 'not_in_telegram' && (
          <div className="py-4 px-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-3 text-[13px]">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{TEXTS.topup.onlyInTelegramMsg}</span>
          </div>
        )}

        {/* Packages List */}
        {simulationState !== 'opening' && (
          <div className="flex flex-col gap-2.5 my-1">
            {view.topupPackages.map((pkg, idx) => {
              const isBest = idx === view.topupPackages.length - 1;
              return (
                <div
                  key={pkg.id}
                  data-testid={`platform-package-${pkg.id}`}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between border transition-all duration-150 ${
                    isBest
                      ? isLightMode
                        ? 'bg-amber-50/50 border-amber-300 shadow-xs'
                        : 'bg-amber-950/20 border-amber-700 shadow-xs'
                      : isLightMode
                      ? 'bg-white border-neutral-200 hover:border-neutral-300'
                      : 'bg-neutral-800/60 border-neutral-700/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 flex items-center justify-center font-extrabold text-[15px]">
                      🪙
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-[16px] tracking-tight">
                          +{pkg.tokens} жетонов
                        </span>
                        {isBest && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-black uppercase flex items-center gap-0.5">
                            <Sparkles className="w-3 h-3" />
                            {TEXTS.topup.bestValue}
                          </span>
                        )}
                      </div>
                      <span className="text-[13px] text-neutral-500 dark:text-neutral-400">
                        {pkg.title} · {pkg.description}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePurchase(pkg.id, pkg.tokens)}
                    disabled={view.busy}
                    className="h-11 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-[14px] flex items-center gap-1 shadow-sm transition-all active:scale-95 shrink-0"
                  >
                    <span>⭐</span>
                    <span>{TEXTS.topup.buyPackage(pkg.stars)}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* State simulation test triggers */}
        <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-[13px] text-neutral-400">
          <span>Тест состояний Stars:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSimulationState('cancelled')}
              className="px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-600 dark:text-neutral-300 text-[13px]"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={() => setSimulationState('error')}
              className="px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-600 dark:text-neutral-300 text-[13px]"
            >
              Ошибка
            </button>
          </div>
        </div>

        {simulationState === 'cancelled' && (
          <p className="text-[13px] text-amber-600 dark:text-amber-400 mt-2 text-center">
            {TEXTS.topup.cancelMsg}
          </p>
        )}
        {simulationState === 'error' && (
          <p className="text-[13px] text-rose-600 dark:text-rose-400 mt-2 text-center">
            {TEXTS.topup.errorMsg}
          </p>
        )}
      </div>
    </div>
  );
};
