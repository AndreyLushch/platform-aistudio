/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { PlatformView, PlatformCommand, PlatformGame } from '../types';
import { TEXTS } from '../texts';
import { GameCard } from '../components/GameCard';
import { PayConfirmModal } from '../sheets/PayConfirmModal';
import { VisualStyle } from '../theme/tokens';
import { triggerHaptic } from '../utils/haptics';
import { calculateGamePrice } from '../engine/pricing';

interface GameSelectScreenProps {
  view: PlatformView;
  send: (cmd: PlatformCommand) => void;
  onBackToQr: () => void;
  onOpenTopup: () => void;
  visualStyle: VisualStyle;
  isLightMode: boolean;
}

export const GameSelectScreen: React.FC<GameSelectScreenProps> = ({
  view,
  send,
  onBackToQr,
  onOpenTopup,
  visualStyle,
  isLightMode,
}) => {
  const [selectedGameForPayment, setSelectedGameForPayment] = useState<PlatformGame | null>(null);

  const playerCount = view.room.players.length;

  const handleSelectGame = (gameId: string) => {
    const game = view.games.find((g) => g.id === gameId);
    if (!game) return;

    const price = calculateGamePrice(game, playerCount);

    // If free game (0 tokens), can confirm directly or show modal
    setSelectedGameForPayment(game);
  };

  const handleConfirmPay = () => {
    if (!selectedGameForPayment) return;
    send({ type: 'PAY_AND_SELECT', gameId: selectedGameForPayment.id });
    triggerHaptic('success', view.prefs.haptics);
    setSelectedGameForPayment(null);
  };

  return (
    <div
      data-testid="platform-screen-game-select"
      className="flex-1 w-full flex flex-col px-4 pt-3 pb-16 select-none"
    >
      {/* Top Navigation Row */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBackToQr}
          className={`h-10 px-3 rounded-xl flex items-center gap-1.5 font-semibold text-[13.5px] border transition-all ${
            isLightMode
              ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'
              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{TEXTS.catalog.backToQr}</span>
        </button>

        <span className="text-[13.5px] font-semibold text-neutral-500 dark:text-neutral-400">
          За столом: <span className="text-amber-600 dark:text-amber-400 font-bold">{playerCount} чел.</span>
        </span>
      </div>

      {/* Catalog Title */}
      <div className="mb-4">
        <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
          {TEXTS.catalog.title}
        </h2>
        <p className="text-[13.5px] text-neutral-500 dark:text-neutral-400 mt-0.5">
          {TEXTS.catalog.subtitle}
        </p>
      </div>

      {/* Games Catalog List */}
      <div className="flex flex-col gap-3.5 mb-6">
        {view.games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            playerCount={playerCount}
            balanceTokens={view.wallet.balanceTokens}
            onSelectAndPay={handleSelectGame}
            onOpenTopup={onOpenTopup}
            visualStyle={visualStyle}
            isLightMode={isLightMode}
          />
        ))}
      </div>

      {/* Payment Confirmation Modal */}
      {selectedGameForPayment && (
        <PayConfirmModal
          isOpen={true}
          tokens={calculateGamePrice(selectedGameForPayment, playerCount)}
          gameTitle={selectedGameForPayment.title}
          onConfirm={handleConfirmPay}
          onCancel={() => setSelectedGameForPayment(null)}
          isLightMode={isLightMode}
        />
      )}
    </div>
  );
};
