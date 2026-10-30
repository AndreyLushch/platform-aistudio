/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LogIn, ArrowRight } from 'lucide-react';
import { PlatformView, PlatformCommand } from '../types';
import { TEXTS } from '../texts';
import { QRCodeCard } from '../components/QRCodeCard';
import { PlayerList } from '../components/PlayerList';
import { BottomBar } from '../components/BottomBar';
import { VisualStyle } from '../theme/tokens';
import { triggerHaptic } from '../utils/haptics';

interface GatheringScreenProps {
  view: PlatformView;
  send: (cmd: PlatformCommand) => void;
  onGoSelectGame: () => void;
  visualStyle: VisualStyle;
  isLightMode: boolean;
}

export const GatheringScreen: React.FC<GatheringScreenProps> = ({
  view,
  send,
  onGoSelectGame,
  visualStyle,
  isLightMode,
}) => {
  const isInRoom = view.me.isInRoom;

  const handleJoin = () => {
    send({ type: 'JOIN_ROOM' });
    triggerHaptic('success', view.prefs.haptics);
  };

  const handleAllGathered = () => {
    send({ type: 'GO_SELECT_GAME' });
    onGoSelectGame();
    triggerHaptic('medium', view.prefs.haptics);
  };

  return (
    <div
      data-testid="platform-screen-gathering"
      className="flex-1 w-full flex flex-col px-4 pt-4 pb-28 select-none"
    >
      {/* Top Banner if user has not yet joined */}
      {!isInRoom && (
        <div
          className={`w-full mb-4 p-3.5 rounded-2xl border flex items-center justify-between gap-3 shadow-xs ${
            isLightMode
              ? 'bg-amber-50/90 border-amber-300/80 text-amber-950'
              : 'bg-amber-950/40 border-amber-700/60 text-amber-200'
          }`}
        >
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[14px]">
              {TEXTS.gathering.notInRoomBanner}
            </span>
            <span className="text-[13px] text-amber-800/80 dark:text-amber-300/80">
              Войди в комнату, чтобы участвовать в игре
            </span>
          </div>
          <button
            type="button"
            data-testid="platform-btn-join-room"
            onClick={handleJoin}
            className="h-10 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[13.5px] flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <LogIn className="w-4 h-4" />
            <span>Войти</span>
          </button>
        </div>
      )}

      {/* Center: Large QR Code Component */}
      <div className="w-full mb-5">
        <QRCodeCard
          joinUrl={view.room.joinUrl}
          membersInGroup={view.chat.membersCount}
          playersInGame={view.room.players.length}
          isLightMode={isLightMode}
          hapticsEnabled={view.prefs.haptics}
        />
      </div>

      {/* Players currently gathered at the table */}
      <div className="w-full mb-2">
        <PlayerList
          players={view.room.players}
          currentUserId={view.user?.id}
          isLightMode={isLightMode}
        />
      </div>

      {/* Sticky Bottom Action */}
      <BottomBar
        primaryLabel={TEXTS.gathering.allGatheredBtn}
        onPrimaryClick={handleAllGathered}
        primaryTestId="platform-btn-all-gathered"
        visualStyle={visualStyle}
        isLightMode={isLightMode}
        hint={
          view.room.players.length < 2
            ? 'Для настольных игр нужно минимум 2 игрока'
            : undefined
        }
      />
    </div>
  );
};
