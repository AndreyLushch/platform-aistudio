/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RoomPhase = 'no_room' | 'lobby' | 'playing' | 'finished';
export type LaunchContext = 'group' | 'private' | 'no_telegram';

export interface PlatformPlayer {
  id: string;
  name: string;            // @username или «Имя Фамилия»
  avatarUrl?: string;
  isHost: boolean;
  status: 'here' | 'away'; // away — нет связи
  score?: number;          // итоги (G5)
}

export interface PlatformGame {
  id: string;
  title: string;
  shortDescription: string;
  emoji?: string;
  minPlayers: number;
  maxPlayers: number;
  durationMin: number;     // минуты
  durationMax: number;
  priceForCurrentPlayers: number; // жетонов при текущем числе игроков; 0 — бесплатно
  tags: string[];
  hasOwnFinale: boolean;   // свой экран финала (Угадайка, Гангстеры) — G5 не показывать
}

export interface PlatformView {
  context: LaunchContext;
  isChannelMember: boolean;
  channelUsername: string;
  user: { id: string; name: string } | null;
  chat: { title?: string; membersCount: number | null };
  room: {
    id: string | null;
    phase: RoomPhase;
    gameId: string | null;
    players: PlatformPlayer[];
    joinUrl: string | null;          // для QR; null — «QR недоступен»
    reentryDecisionNeeded: boolean;  // «Комната опустела»
  };
  me: { isInRoom: boolean; isHost: boolean };
  permissions: {
    canJoinRoom: boolean;
    canChooseGame: boolean;
    canPayForGame: boolean;
    canStartGame: boolean;
    canClaimHost: boolean;
  };
  wallet: { balanceTokens: number };
  paymentLock: { payerId: string; tokens: number } | null; // оплаченная, ещё не начатая партия
  games: PlatformGame[];
  topupPackages: Array<{ id: string; tokens: number; stars: number; title: string; description?: string }>;
  prefs: { theme: 'telegram' | 'light' | 'dark'; haptics: boolean };
  busy: boolean;                     // идёт запрос
  error: { code: 'INSUFFICIENT_TOKENS' | 'PRICE_CHANGED' | 'ROOM_NOT_JOINABLE' | 'NETWORK' | 'MAINTENANCE' | 'UNKNOWN'; message: string } | null;
}

export type PlatformCommand =
  | { type: 'JOIN_ROOM' }
  | { type: 'GO_SELECT_GAME' }                     // G1 → G2
  | { type: 'BACK_TO_QR' }                         // G2 → G1
  | { type: 'PAY_AND_SELECT'; gameId: string }     // оплатить и стать ведущим (G2 → G3)
  | { type: 'CANCEL_GAME' }                        // ведущий: отмена с возвратом (G3 → G2)
  | { type: 'START_GAME' }
  | { type: 'CLAIM_HOST' }
  | { type: 'REENTRY'; decision: 'resume' | 'new' }
  | { type: 'LEAVE_GAME' }
  | { type: 'PLAY_AGAIN' }
  | { type: 'CHOOSE_ANOTHER' }
  | { type: 'BUY_PACKAGE'; packageId: string }
  | { type: 'OPEN_CHANNEL' }
  | { type: 'RECHECK_CHANNEL' }
  | { type: 'SET_PREFS'; theme?: 'telegram' | 'light' | 'dark'; haptics?: boolean };
