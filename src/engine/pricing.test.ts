/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateGamePrice, validatePlayerCount, computePermissions } from './pricing';
import { PlatformGame, PlatformPlayer } from '../types';

const sampleGames: PlatformGame[] = [
  {
    id: 'guesser',
    title: 'Угадайка',
    shortDescription: 'Объясняй слова на скорость без однокоренных',
    emoji: '🎭',
    minPlayers: 4,
    maxPlayers: 25,
    durationMin: 15,
    durationMax: 30,
    priceForCurrentPlayers: 10,
    tags: ['Командная', 'Слова', 'Шумная'],
    hasOwnFinale: true,
  },
  {
    id: 'quiz_express',
    title: 'Квиз Экспресс',
    shortDescription: 'Быстрые интеллектуальные раунды для разминки',
    emoji: '⚡',
    minPlayers: 2,
    maxPlayers: 30,
    durationMin: 10,
    durationMax: 20,
    priceForCurrentPlayers: 0,
    tags: ['Эрудиция', 'Бесплатно'],
    hasOwnFinale: false,
  },
];

const mockPlayers: PlatformPlayer[] = [
  { id: 'u1', name: 'Анна', isHost: true, status: 'here' },
  { id: 'u2', name: 'Борис', isHost: false, status: 'here' },
  { id: 'u3', name: 'Вика', isHost: false, status: 'here' },
  { id: 'u4', name: 'Денис', isHost: false, status: 'here' },
];

test('calculateGamePrice returns 0 for free games', () => {
  assert.equal(calculateGamePrice(sampleGames[1], 10), 0);
});

test('calculateGamePrice scales price for games based on player count', () => {
  // 6 players = 10 tokens
  assert.equal(calculateGamePrice(sampleGames[0], 6), 10);
  // 7 players = 10 + (7-6)*2 = 12
  assert.equal(calculateGamePrice(sampleGames[0], 7), 12);
});

test('validatePlayerCount correctly identifies too few or too many players', () => {
  const tooFew = validatePlayerCount(sampleGames[0], 3);
  assert.equal(tooFew.valid, false);
  assert.equal(tooFew.reason, 'TOO_FEW');

  const valid = validatePlayerCount(sampleGames[0], 5);
  assert.equal(valid.valid, true);

  const tooMany = validatePlayerCount(sampleGames[0], 26);
  assert.equal(tooMany.valid, false);
  assert.equal(tooMany.reason, 'TOO_MANY');
});

test('computePermissions gives canStartGame only to host when player count meets requirement', () => {
  const permsHost = computePermissions({
    isInRoom: true,
    isHost: true,
    roomPhase: 'lobby',
    gameId: 'guesser',
    players: mockPlayers, // 4 players, min is 4
    selectedGame: sampleGames[0],
    balanceTokens: 20,
  });
  assert.equal(permsHost.canStartGame, true);

  const permsGuest = computePermissions({
    isInRoom: true,
    isHost: false,
    roomPhase: 'lobby',
    gameId: 'guesser',
    players: mockPlayers,
    selectedGame: sampleGames[0],
    balanceTokens: 20,
  });
  assert.equal(permsGuest.canStartGame, false);
});

test('computePermissions allows claimHost only when host is away', () => {
  const playersWithAwayHost: PlatformPlayer[] = [
    { id: 'u1', name: 'Анна', isHost: true, status: 'away' },
    { id: 'u2', name: 'Борис', isHost: false, status: 'here' },
  ];

  const permsGuestAwayHost = computePermissions({
    isInRoom: true,
    isHost: false,
    roomPhase: 'lobby',
    gameId: null,
    players: playersWithAwayHost,
    selectedGame: null,
    balanceTokens: 10,
  });
  assert.equal(permsGuestAwayHost.canClaimHost, true);

  const permsGuestActiveHost = computePermissions({
    isInRoom: true,
    isHost: false,
    roomPhase: 'lobby',
    gameId: null,
    players: mockPlayers,
    selectedGame: null,
    balanceTokens: 10,
  });
  assert.equal(permsGuestActiveHost.canClaimHost, false);
});
