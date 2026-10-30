/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlatformGame, PlatformPlayer } from '../types';

/**
 * Calculates game price in tokens for the given number of players.
 * If priceForCurrentPlayers is given, it's the base formula.
 */
export function calculateGamePrice(game: PlatformGame, playerCount: number): number {
  if (game.priceForCurrentPlayers === 0) return 0;
  // Free game remains 0
  if (game.id === 'quiz_express') return 0;

  // Base pricing model: e.g. Gangsters is 10 tokens for 6 players, scaled smoothly
  if (game.id === 'gangsters') {
    // 10 tokens for <= 6 players, +1 token per extra player above 6
    return playerCount <= 6 ? 10 : 10 + (playerCount - 6);
  }

  if (game.id === 'guesser') {
    // 10 tokens for 6 players
    return playerCount <= 6 ? 10 : 10 + (playerCount - 6) * 2;
  }

  if (game.id === 'bunker') {
    return 15;
  }

  return game.priceForCurrentPlayers;
}

/**
 * Validates player count for a given game.
 */
export function validatePlayerCount(
  game: PlatformGame,
  playerCount: number
): { valid: boolean; reason?: 'TOO_FEW' | 'TOO_MANY' } {
  if (playerCount < game.minPlayers) {
    return { valid: false, reason: 'TOO_FEW' };
  }
  if (playerCount > game.maxPlayers) {
    return { valid: false, reason: 'TOO_MANY' };
  }
  return { valid: true };
}

/**
 * Determines permissions for current user based on room state.
 */
export function computePermissions(params: {
  isInRoom: boolean;
  isHost: boolean;
  roomPhase: string;
  gameId: string | null;
  players: PlatformPlayer[];
  selectedGame: PlatformGame | null;
  balanceTokens: number;
}): {
  canJoinRoom: boolean;
  canChooseGame: boolean;
  canPayForGame: boolean;
  canStartGame: boolean;
  canClaimHost: boolean;
} {
  const { isInRoom, isHost, roomPhase, selectedGame, players, balanceTokens } = params;

  // Can join room if not already in room and room is in lobby phase (before start)
  const canJoinRoom = !isInRoom && roomPhase === 'lobby';

  // Can choose game if in room during lobby and not locked by start
  const canChooseGame = isInRoom && roomPhase === 'lobby';

  // Can pay for game if in room, during lobby phase, has enough balance, and game player constraints are met
  let canPayForGame = false;
  if (isInRoom && roomPhase === 'lobby' && selectedGame) {
    const price = calculateGamePrice(selectedGame, players.length);
    const playerCountOk = players.length >= selectedGame.minPlayers && players.length <= selectedGame.maxPlayers;
    canPayForGame = playerCountOk && balanceTokens >= price;
  }

  // Can start game if host, in lobby, game chosen, and player count >= min
  let canStartGame = false;
  if (isHost && roomPhase === 'lobby' && selectedGame) {
    canStartGame = players.length >= selectedGame.minPlayers && players.length <= selectedGame.maxPlayers;
  }

  // Can claim host if in room, not host, and current host is 'away'
  const currentHost = players.find((p) => p.isHost);
  const isHostAway = currentHost ? currentHost.status === 'away' : true;
  const canClaimHost = isInRoom && !isHost && isHostAway && (roomPhase === 'lobby' || roomPhase === 'playing');

  return {
    canJoinRoom,
    canChooseGame,
    canPayForGame,
    canStartGame,
    canClaimHost,
  };
}
