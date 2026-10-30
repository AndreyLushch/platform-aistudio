/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Crown, QrCode, RotateCcw, AlertTriangle, Users, Sparkles, LogIn, ShieldAlert } from 'lucide-react';
import { PlatformView, PlatformCommand } from '../types';
import { TEXTS } from '../texts';
import { PlayerList } from '../components/PlayerList';
import { BottomBar } from '../components/BottomBar';
import { CancelGameModal } from '../sheets/CancelGameModal';
import { VisualStyle } from '../theme/tokens';
import { triggerHaptic } from '../utils/haptics';
import { validatePlayerCount } from '../engine/pricing';

interface LobbyScreenProps {
  view: PlatformView;
  send: (cmd: PlatformCommand) => void;
  onOpenInvite: () => void;
  visualStyle: VisualStyle;
  isLightMode: boolean;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  view,
  send,
  onOpenInvite,
  visualStyle,
  isLightMode,
}) => {
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  const selectedGame = view.games.find((g) => g.id === view.room.gameId);
  const playerCount = view.room.players.length;
  const isHost = view.me.isHost;
  const isInRoom = view.me.isInRoom;

  // Validation
  const validation = selectedGame ? validatePlayerCount(selectedGame, playerCount) : { valid: false };
  const canStart = view.permissions.canStartGame;
  const canClaimHost = view.permissions.canClaimHost;

  const currentHost = view.room.players.find((p) => p.isHost);
  const isHostAway = currentHost?.status === 'away';

  const handleStartGame = () => {
    send({ type: 'START_GAME' });
    triggerHaptic('heavy', view.prefs.haptics);
  };

  const handleCancelGame = () => {
    setIsCancelConfirmOpen(true);
  };

  const handleConfirmCancel = () => {
    send({ type: 'CANCEL_GAME' });
    triggerHaptic('warning', view.prefs.haptics);
    setIsCancelConfirmOpen(false);
  };

  const handleClaimHost = () => {
    send({ type: 'CLAIM_HOST' });
    triggerHaptic('success', view.prefs.haptics);
  };

  const handleJoinRoom = () => {
    send({ type: 'JOIN_ROOM' });
    triggerHaptic('success', view.prefs.haptics);
  };

  return (
    <div
      data-testid="platform-screen-lobby"
      className="flex-1 w-full flex flex-col px-4 pt-3 pb-28 select-none"
    >
      {/* Selected Game Card Header */}
      {selectedGame && (
        <div
          className={`w-full p-4 rounded-3xl border mb-4 flex items-center justify-between shadow-xs transition-colors ${
            isLightMode
              ? 'bg-amber-50/70 border-amber-300/80 text-amber-950'
              : 'bg-amber-950/30 border-amber-800/60 text-amber-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-2xl shadow-xs">
              {selectedGame.emoji || '🎲'}
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-amber-800/80 dark:text-amber-300/80">
                {TEXTS.lobby.selectedGame}
              </span>
              <h3 className="font-extrabold text-[17px] tracking-tight text-neutral-900 dark:text-neutral-100">
                {selectedGame.title}
              </h3>
              <span className="text-[13px] text-neutral-500 dark:text-neutral-400">
                {selectedGame.minPlayers}–{selectedGame.maxPlayers} игроков · {selectedGame.durationMin}–{selectedGame.durationMax} мин
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400">
              {TEXTS.lobby.cost}
            </span>
            <span className="font-black text-[16px] text-amber-700 dark:text-amber-300">
              {view.paymentLock ? `🪙 ${view.paymentLock.tokens}` : 'Бесплатно'}
            </span>
          </div>
        </div>
      )}

      {/* Price changed error notice if triggered */}
      {view.error?.code === 'PRICE_CHANGED' && (
        <div className="w-full mb-3 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-200 flex items-center gap-2.5 text-[13.5px]">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>{view.error.message || TEXTS.errors.PRICE_CHANGED}</span>
        </div>
      )}

      {/* Host Away Takeover Notice */}
      {isHostAway && canClaimHost && (
        <div
          className={`w-full mb-3 p-3.5 rounded-2xl border flex items-center justify-between gap-3 shadow-xs ${
            isLightMode
              ? 'bg-rose-50 border-rose-200 text-rose-950'
              : 'bg-rose-950/40 border-rose-800 text-rose-200'
          }`}
        >
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[14px] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              Ведущий отошёл
            </span>
            <span className="text-[13px] text-neutral-600 dark:text-neutral-400">
              {TEXTS.lobby.hostAwayNotice}
            </span>
          </div>
          <button
            type="button"
            data-testid="platform-btn-claim-host"
            onClick={handleClaimHost}
            className="h-10 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[13.5px] shrink-0 shadow-xs active:scale-95 transition-all"
          >
            {TEXTS.lobby.claimHostBtn}
          </button>
        </div>
      )}

      {/* Invite Friends Action Button */}
      <div className="w-full mb-3">
        <button
          type="button"
          onClick={onOpenInvite}
          className={`w-full h-11 px-4 rounded-2xl flex items-center justify-between font-semibold text-[14px] border transition-all ${
            isLightMode
              ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200/90'
              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>{TEXTS.lobby.inviteBtn}</span>
          </span>
          <span className="text-[13px] font-bold text-amber-700 dark:text-amber-400">
            {playerCount} за столом →
          </span>
        </button>
      </div>

      {/* Players List in Lobby */}
      <div className="w-full flex-1 mb-4">
        <PlayerList
          players={view.room.players}
          currentUserId={view.user?.id}
          isLightMode={isLightMode}
        />
      </div>

      {/* Bottom Sticky Action Bar depending on Perspective */}
      {isHost ? (
        <BottomBar
          primaryLabel={TEXTS.lobby.hostControls.startGame}
          onPrimaryClick={handleStartGame}
          primaryDisabled={!canStart}
          primaryTestId="platform-btn-start-game"
          secondaryLabel={TEXTS.lobby.hostControls.cancelGame}
          onSecondaryClick={handleCancelGame}
          secondaryTestId="platform-btn-cancel-game"
          visualStyle={visualStyle}
          isLightMode={isLightMode}
          hint={
            !canStart && selectedGame
              ? playerCount < selectedGame.minPlayers
                ? TEXTS.lobby.hostControls.notEnoughPlayers(selectedGame.minPlayers, playerCount)
                : TEXTS.lobby.hostControls.tooManyPlayers(selectedGame.maxPlayers, playerCount)
              : undefined
          }
        />
      ) : !isInRoom ? (
        <BottomBar
          primaryLabel={TEXTS.lobby.joinRoom}
          onPrimaryClick={handleJoinRoom}
          primaryTestId="platform-btn-join-room"
          visualStyle={visualStyle}
          isLightMode={isLightMode}
          hint={TEXTS.lobby.notJoined}
        />
      ) : (
        <BottomBar
          primaryLabel="Готов к игре"
          onPrimaryClick={() => {}}
          primaryDisabled={true}
          visualStyle={visualStyle}
          isLightMode={isLightMode}
          hint={TEXTS.lobby.playerWaiting}
        />
      )}

      {/* Cancel Game Confirmation Modal */}
      {isCancelConfirmOpen && (
        <CancelGameModal
          isOpen={true}
          tokens={view.paymentLock?.tokens ?? 0}
          onConfirm={handleConfirmCancel}
          onCancel={() => setIsCancelConfirmOpen(false)}
          isLightMode={isLightMode}
        />
      )}
    </div>
  );
};
