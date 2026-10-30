/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Crown, WifiOff } from 'lucide-react';
import { PlatformPlayer } from '../types';
import { TEXTS } from '../texts';

interface PlayerListProps {
  players: PlatformPlayer[];
  currentUserId?: string;
  isLightMode: boolean;
  showScores?: boolean;
}

const AVATAR_COLORS = [
  'bg-amber-500 text-white',
  'bg-emerald-500 text-white',
  'bg-indigo-500 text-white',
  'bg-rose-500 text-white',
  'bg-cyan-500 text-white',
  'bg-violet-500 text-white',
  'bg-orange-500 text-white',
  'bg-teal-500 text-white',
];

export const PlayerList: React.FC<PlayerListProps> = ({
  players,
  currentUserId,
  isLightMode,
  showScores = false,
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[14px] font-bold tracking-tight text-neutral-800 dark:text-neutral-200">
          {TEXTS.lobby.playersListTitle(players.length)}
        </h3>
        <span className="text-[13px] text-neutral-500 dark:text-neutral-400">
          за столом
        </span>
      </div>

      <div className="w-full flex flex-col gap-1.5 max-h-[320px] overflow-y-auto pr-1">
        {players.map((player, idx) => {
          const isMe = player.id === currentUserId || player.id === 'usr_me';
          const isAway = player.status === 'away';
          const initials = player.name
            .split(' ')
            .map((s) => s[0])
            .join('')
            .substring(0, 2)
            .toUpperCase() || 'ИГ';
          const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];

          return (
            <div
              key={player.id}
              className={`w-full px-3.5 py-2.5 rounded-2xl flex items-center justify-between border transition-all duration-200 ${
                isMe
                  ? isLightMode
                    ? 'bg-amber-50/70 border-amber-300/80 shadow-xs'
                    : 'bg-amber-950/30 border-amber-700/60 shadow-xs'
                  : isLightMode
                  ? 'bg-white/80 border-neutral-200/80 hover:bg-neutral-50'
                  : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-900'
              }`}
            >
              {/* Left: Avatar + Name */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  {player.avatarUrl ? (
                    <img
                      src={player.avatarUrl}
                      alt={player.name}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] shadow-xs ${avatarColor}`}
                    >
                      {initials}
                    </div>
                  )}

                  {player.isHost && (
                    <div
                      title={TEXTS.lobby.hostBadge}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs border border-white dark:border-neutral-900"
                    >
                      <Crown className="w-3 h-3 fill-current" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[14.5px] truncate text-neutral-900 dark:text-neutral-100">
                      {player.name}
                    </span>
                    {isMe && (
                      <span className="text-[13px] font-medium text-amber-600 dark:text-amber-400">
                        (Ты)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {player.isHost ? (
                      <span className="text-[13px] font-medium text-amber-700 dark:text-amber-300 flex items-center gap-1">
                        <Crown className="w-3 h-3 fill-current" />
                        {TEXTS.lobby.hostBadge}
                      </span>
                    ) : (
                      <span className="text-[13px] text-neutral-500 dark:text-neutral-400">
                        Игрок
                      </span>
                    )}

                    {isAway && (
                      <span className="text-[13px] font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <WifiOff className="w-3 h-3" />
                        {TEXTS.lobby.awayBadge}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Score or status indicator */}
              {showScores && player.score !== undefined ? (
                <div className="shrink-0 flex items-center gap-1 font-extrabold text-[16px] text-amber-600 dark:text-amber-400">
                  <span className="tabular-nums">{player.score}</span>
                  <span className="text-[13px] font-medium text-neutral-400">очков</span>
                </div>
              ) : (
                <div className="shrink-0 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isAway ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                  />
                  <span className="text-[13px] font-medium text-neutral-400">
                    {isAway ? 'отошёл' : 'в сети'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
