/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LogOut, Users } from 'lucide-react';
import { PlatformView, PlatformCommand } from '../types';
import { TEXTS } from '../texts';
import { GameSlot, GameSlotType } from '../components/GameSlot';
import { LeaveConfirmModal } from '../sheets/LeaveConfirmModal';
import { triggerHaptic } from '../utils/haptics';

interface PartyScreenProps {
  view: PlatformView;
  send: (cmd: PlatformCommand) => void;
  gameSlotOverride?: GameSlotType;
  isLightMode: boolean;
}

export const PartyScreen: React.FC<PartyScreenProps> = ({
  view,
  send,
  gameSlotOverride,
  isLightMode,
}) => {
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);

  const selectedGame = view.games.find((g) => g.id === view.room.gameId);
  const gameTitle = selectedGame?.title || 'Игра';
  const playerCount = view.room.players.length;

  // Determine slot type: explicit override or by gameId
  let activeSlotType: GameSlotType = 'guesser';
  if (gameSlotOverride) {
    activeSlotType = gameSlotOverride;
  } else if (view.room.gameId === 'gangsters') {
    activeSlotType = 'gangsters';
  } else if (view.room.gameId === 'guesser') {
    activeSlotType = 'guesser';
  } else {
    activeSlotType = 'empty';
  }

  const handleConfirmLeave = () => {
    send({ type: 'LEAVE_GAME' });
    triggerHaptic('warning', view.prefs.haptics);
    setIsLeaveConfirmOpen(false);
  };

  return (
    <div
      data-testid="platform-screen-party"
      className="flex-1 w-full flex flex-col h-full relative select-none"
    >
      {/* Narrow Neutral Platform Top Bar (does not distract from the game) */}
      <div
        className={`w-full px-3.5 py-2 flex items-center justify-between border-b z-20 transition-colors ${
          isLightMode
            ? 'bg-white/90 border-neutral-200/90 text-neutral-800'
            : 'bg-neutral-950/90 border-neutral-800 text-neutral-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold text-[14.5px] tracking-tight">{gameTitle}</span>
          <span className="text-[13px] text-neutral-400">·</span>
          <span className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{TEXTS.party.playersCount(playerCount)}</span>
          </span>
        </div>

        <button
          type="button"
          data-testid="platform-btn-leave-game"
          onClick={() => setIsLeaveConfirmOpen(true)}
          className="h-8 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold text-[13px] flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-800 transition-colors active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-500" />
          <span>{TEXTS.party.leaveBtn}</span>
        </button>
      </div>

      {/* Game Area Slot */}
      <div className="flex-1 w-full flex flex-col relative overflow-hidden">
        <GameSlot
          slotType={activeSlotType}
          gameTitle={gameTitle}
          isLightMode={isLightMode}
        />
      </div>

      {/* Leave Game Confirmation Modal */}
      {isLeaveConfirmOpen && (
        <LeaveConfirmModal
          isOpen={true}
          onConfirm={handleConfirmLeave}
          onCancel={() => setIsLeaveConfirmOpen(false)}
          isLightMode={isLightMode}
        />
      )}
    </div>
  );
};
