/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trophy, Medal, RotateCcw, Compass, Sparkles } from 'lucide-react';
import { PlatformView, PlatformCommand } from '../types';
import { TEXTS } from '../texts';
import { PlayerList } from '../components/PlayerList';
import { BottomBar } from '../components/BottomBar';
import { VisualStyle } from '../theme/tokens';
import { triggerHaptic } from '../utils/haptics';

interface FinishedScreenProps {
  view: PlatformView;
  send: (cmd: PlatformCommand) => void;
  visualStyle: VisualStyle;
  isLightMode: boolean;
}

export const FinishedScreen: React.FC<FinishedScreenProps> = ({
  view,
  send,
  visualStyle,
  isLightMode,
}) => {
  const isHost = view.me.isHost;

  // Sort players by score descending
  const sortedPlayers = [...view.room.players].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const winner = sortedPlayers[0];

  const handlePlayAgain = () => {
    send({ type: 'PLAY_AGAIN' });
    triggerHaptic('medium', view.prefs.haptics);
  };

  const handleChooseAnother = () => {
    send({ type: 'CHOOSE_ANOTHER' });
    triggerHaptic('light', view.prefs.haptics);
  };

  return (
    <div
      data-testid="platform-screen-finished"
      className="flex-1 w-full flex flex-col px-4 pt-4 pb-28 select-none"
    >
      {/* Winner Podium Banner */}
      <div
        className={`w-full p-5 rounded-3xl border mb-5 flex flex-col items-center text-center shadow-md relative overflow-hidden transition-colors ${
          isLightMode
            ? 'bg-gradient-to-b from-amber-50 to-white border-amber-300/80 text-amber-950'
            : 'bg-gradient-to-b from-amber-950/40 to-neutral-900 border-amber-800/60 text-amber-100'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-3xl shadow-lg mb-3">
          <Trophy className="w-8 h-8 fill-current" />
        </div>

        <span className="text-[13px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
          {TEXTS.finished.winner}
        </span>

        <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 mt-1">
          {winner?.name || 'Победитель'}
        </h2>

        {winner?.score !== undefined && (
          <div className="mt-2 px-3.5 py-1 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-extrabold text-[14px]">
            {winner.score} очков
          </div>
        )}
      </div>

      {/* Players Results Ranking */}
      <div className="w-full flex-1 mb-4">
        <PlayerList
          players={sortedPlayers}
          currentUserId={view.user?.id}
          isLightMode={isLightMode}
          showScores={true}
        />
      </div>

      {/* Bottom Actions depending on host status */}
      {isHost ? (
        <BottomBar
          primaryLabel={TEXTS.finished.hostActions.playAgain}
          onPrimaryClick={handlePlayAgain}
          primaryTestId="platform-btn-play-again"
          secondaryLabel={TEXTS.finished.hostActions.chooseAnother}
          onSecondaryClick={handleChooseAnother}
          secondaryTestId="platform-btn-choose-another"
          visualStyle={visualStyle}
          isLightMode={isLightMode}
        />
      ) : (
        <BottomBar
          primaryLabel="Ждём решение ведущего"
          onPrimaryClick={() => {}}
          primaryDisabled={true}
          visualStyle={visualStyle}
          isLightMode={isLightMode}
          hint={TEXTS.finished.guestWaiting}
        />
      )}
    </div>
  );
};
