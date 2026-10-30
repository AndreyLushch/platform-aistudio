/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, Clock, Lock, Sparkles } from 'lucide-react';
import { PlatformGame } from '../types';
import { TEXTS } from '../texts';
import { VisualStyle, VISUAL_STYLES } from '../theme/tokens';
import { validatePlayerCount } from '../engine/pricing';

interface GameCardProps {
  game: PlatformGame;
  playerCount: number;
  balanceTokens: number;
  onSelectAndPay: (gameId: string) => void;
  onOpenTopup: () => void;
  visualStyle: VisualStyle;
  isLightMode: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  playerCount,
  balanceTokens,
  onSelectAndPay,
  onOpenTopup,
  visualStyle,
  isLightMode,
}) => {
  const style = VISUAL_STYLES[visualStyle];
  const countValidation = validatePlayerCount(game, playerCount);
  const price = game.priceForCurrentPlayers;
  const isFree = price === 0;
  const hasEnoughTokens = balanceTokens >= price;
  const isAvailable = countValidation.valid && hasEnoughTokens;

  return (
    <div
      data-testid={`platform-game-${game.id}`}
      className={`w-full rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between gap-4 ${
        isAvailable
          ? isLightMode
            ? `${style.cardBgLight} border-amber-300/80 hover:shadow-md`
            : `${style.cardBgDark} hover:border-amber-500/40`
          : isLightMode
          ? 'bg-neutral-50/90 border-neutral-200 opacity-90'
          : 'bg-neutral-900/40 border-neutral-800 opacity-85'
      }`}
    >
      {/* Top row: Emoji & Title & Price Pill */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs border ${
              isLightMode
                ? 'bg-white border-neutral-200/80'
                : 'bg-neutral-800 border-neutral-700/60'
            }`}
          >
            {game.emoji || '🎲'}
          </div>
          <div className="flex flex-col">
            <h3 className="font-extrabold text-[17px] tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <span>{game.title}</span>
              {isFree && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                  FREE
                </span>
              )}
            </h3>
            <p className="text-[13.5px] text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-0.5">
              {game.shortDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Meta Specs: Players & Duration & Tags */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-200/60 dark:border-neutral-800/80">
        <div className="flex items-center gap-1 text-[13px] font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/70 px-2.5 py-1 rounded-xl">
          <Users className="w-3.5 h-3.5" />
          <span>{game.minPlayers}–{game.maxPlayers} игроков</span>
        </div>

        <div className="flex items-center gap-1 text-[13px] font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/70 px-2.5 py-1 rounded-xl">
          <Clock className="w-3.5 h-3.5" />
          <span>{game.durationMin}–{game.durationMax} мин</span>
        </div>

        {game.tags.map((tag) => (
          <span
            key={tag}
            className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100/60 dark:bg-neutral-800/40 px-2 py-1 rounded-xl"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Pricing & Lock Warnings */}
      <div className="flex flex-col gap-2 pt-1">
        {/* Price Row */}
        <div className="flex items-center justify-between">
          <span className="text-[13.5px] font-medium text-neutral-500 dark:text-neutral-400">
            {isFree ? 'Стоимость' : `Стоимость (${playerCount} за столом)`}:
          </span>
          <span
            className={`font-black text-[15px] flex items-center gap-1 ${
              isFree
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-amber-700 dark:text-amber-300'
            }`}
          >
            {isFree ? (
              TEXTS.catalog.free
            ) : (
              <>
                <span className="text-[16px]">{TEXTS.app.tokensSymbol}</span>
                <span>{TEXTS.catalog.priceTokens(price, playerCount)}</span>
              </>
            )}
          </span>
        </div>

        {/* Lock warning if conditions not met */}
        {!countValidation.valid && (
          <div className="w-full px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-center gap-2 text-[13px] font-medium">
            <Lock className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              {countValidation.reason === 'TOO_FEW'
                ? TEXTS.catalog.minPlayersWarning(game.minPlayers, playerCount)
                : TEXTS.catalog.maxPlayersWarning(game.maxPlayers, playerCount)}
            </span>
          </div>
        )}

        {countValidation.valid && !hasEnoughTokens && (
          <div className="w-full px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 flex items-center justify-between gap-2 text-[13px] font-medium">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{TEXTS.catalog.notEnoughTokensWarning(price - balanceTokens)}</span>
            </div>
            <button
              type="button"
              onClick={onOpenTopup}
              className="text-[13px] font-bold underline underline-offset-2 text-rose-700 dark:text-rose-300 hover:opacity-80"
            >
              {TEXTS.catalog.topupShort}
            </button>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="pt-1">
        {countValidation.valid && !hasEnoughTokens ? (
          <button
            type="button"
            data-testid="platform-btn-topup"
            onClick={onOpenTopup}
            className="w-full h-12 rounded-2xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-[14px] flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Пополнить баланс на {price - balanceTokens} жетонов</span>
          </button>
        ) : (
          <button
            type="button"
            disabled={!countValidation.valid}
            onClick={() => onSelectAndPay(game.id)}
            className={`w-full h-12 rounded-2xl font-bold text-[14.5px] flex items-center justify-center gap-2 transition-all shadow-sm ${
              countValidation.valid
                ? `${style.primaryBg} ${style.primaryHover} ${style.primaryText} active:scale-[0.98]`
                : 'bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500 cursor-not-allowed'
            }`}
          >
            <span>{TEXTS.catalog.selectAndPay}</span>
          </button>
        )}
      </div>
    </div>
  );
};
