/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PlatformCommand,
  PlatformGame,
  PlatformPlayer,
  PlatformView,
} from '../types';
import { PlatformAdapter } from './PlatformAdapter';
import { calculateGamePrice, computePermissions } from '../engine/pricing';

export const INITIAL_GAMES: PlatformGame[] = [
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
    tags: ['Хит', 'Командная', 'Слова'],
    hasOwnFinale: true,
  },
  {
    id: 'gangsters',
    title: 'Гангстеры',
    shortDescription: 'Психологическая дедукция и мафиозные перестрелки',
    emoji: '🕵️‍♂️',
    minPlayers: 5,
    maxPlayers: 20,
    durationMin: 20,
    durationMax: 45,
    priceForCurrentPlayers: 12,
    tags: ['Дедукция', 'Тайные роли'],
    hasOwnFinale: true,
  },
  {
    id: 'quiz_express',
    title: 'Квиз Экспресс',
    shortDescription: 'Быстрые интеллектуальные раунды для всей компании',
    emoji: '⚡',
    minPlayers: 2,
    maxPlayers: 30,
    durationMin: 10,
    durationMax: 20,
    priceForCurrentPlayers: 0,
    tags: ['Бесплатно', 'Эрудиция'],
    hasOwnFinale: false,
  },
  {
    id: 'bunker',
    title: 'Бункер: Выживание',
    shortDescription: 'Катастрофа на пороге. Докажи, что ты достоин спасения',
    emoji: '☢️',
    minPlayers: 6,
    maxPlayers: 16,
    durationMin: 30,
    durationMax: 60,
    priceForCurrentPlayers: 15,
    tags: ['Дискуссионная', 'Ролевая'],
    hasOwnFinale: false,
  },
];

export const INITIAL_PACKAGES = [
  {
    id: 'pkg_starter',
    tokens: 20,
    stars: 50,
    title: 'Стартовый',
    description: 'Хватит на 2 партии',
  },
  {
    id: 'pkg_standard',
    tokens: 50,
    stars: 100,
    title: 'Компания',
    description: 'Хватит на 5 партий',
  },
  {
    id: 'pkg_pro',
    tokens: 120,
    stars: 200,
    title: 'Вечеринка',
    description: 'Самый выгодный пакет',
  },
];

export class MockAdapter implements PlatformAdapter {
  private view: PlatformView;
  private listeners: Set<(view: PlatformView) => void> = new Set();
  private autoJoinTimer: ReturnType<typeof setInterval> | null = null;
  private isSimulatingArrivals = false;

  constructor(initialPlayerCount = 5) {
    const mePlayer: PlatformPlayer = {
      id: 'usr_me',
      name: 'Андрей',
      isHost: false,
      status: 'here',
      avatarUrl: undefined,
    };

    const initialOtherPlayers: PlatformPlayer[] = [
      { id: 'usr_2', name: 'Мария', isHost: true, status: 'here' },
      { id: 'usr_3', name: 'Артём', isHost: false, status: 'here' },
      { id: 'usr_4', name: 'Елена', isHost: false, status: 'here' },
      { id: 'usr_5', name: 'Константин', isHost: false, status: 'here' },
    ];

    const players = [mePlayer, ...initialOtherPlayers.slice(0, Math.max(0, initialPlayerCount - 1))];

    this.view = {
      context: 'group',
      isChannelMember: true,
      channelUsername: 'nastolki_official',
      user: { id: 'usr_me', name: 'Андрей' },
      chat: {
        title: 'Уютный вечер с друзьями 🍕',
        membersCount: 14,
      },
      room: {
        id: 'room_party_442',
        phase: 'lobby',
        gameId: null,
        players,
        joinUrl: 'https://t.me/nastolki_bot/app?startapp=room_party_442',
        reentryDecisionNeeded: false,
      },
      me: {
        isInRoom: true,
        isHost: false,
      },
      permissions: {
        canJoinRoom: false,
        canChooseGame: true,
        canPayForGame: false,
        canStartGame: false,
        canClaimHost: false,
      },
      wallet: {
        balanceTokens: 35,
      },
      paymentLock: null,
      games: this.calculateGamesForPlayers(INITIAL_GAMES, players.length),
      topupPackages: INITIAL_PACKAGES,
      prefs: {
        theme: 'telegram',
        haptics: true,
      },
      busy: false,
      error: null,
    };

    this.recomputeState();
  }

  public getView(): PlatformView {
    return this.view;
  }

  public subscribe(callback: (view: PlatformView) => void): () => void {
    this.listeners.add(callback);
    callback(this.view);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public send(cmd: PlatformCommand): void {
    switch (cmd.type) {
      case 'JOIN_ROOM': {
        if (!this.view.me.isInRoom) {
          const myUser: PlatformPlayer = {
            id: this.view.user?.id || 'usr_me',
            name: this.view.user?.name || 'Я',
            isHost: this.view.room.players.length === 0,
            status: 'here',
          };
          this.view.room.players.push(myUser);
          this.view.me.isInRoom = true;
          this.view.me.isHost = myUser.isHost;
          this.recomputeState();
        }
        break;
      }

      case 'GO_SELECT_GAME': {
        // Just state update; UI displays selection view
        this.recomputeState();
        break;
      }

      case 'BACK_TO_QR': {
        this.recomputeState();
        break;
      }

      case 'PAY_AND_SELECT': {
        const game = this.view.games.find((g) => g.id === cmd.gameId);
        if (!game) return;

        const price = calculateGamePrice(game, this.view.room.players.length);
        if (this.view.wallet.balanceTokens < price) {
          this.view.error = {
            code: 'INSUFFICIENT_TOKENS',
            message: 'Недостаточно жетонов для оплаты партии.',
          };
          this.notify();
          return;
        }

        // Refund previous payer if another player already locked
        if (this.view.paymentLock && this.view.paymentLock.payerId === 'usr_me') {
          // Self re-selection: restore previous lock
          this.view.wallet.balanceTokens += this.view.paymentLock.tokens;
        }

        // Deduct payment
        this.view.wallet.balanceTokens -= price;
        this.view.paymentLock = {
          payerId: 'usr_me',
          tokens: price,
        };

        // Current user becomes host!
        this.view.room.gameId = game.id;
        this.view.me.isHost = true;
        this.view.room.players = this.view.room.players.map((p) => ({
          ...p,
          isHost: p.id === 'usr_me',
        }));

        this.view.error = null;
        this.recomputeState();
        break;
      }

      case 'CANCEL_GAME': {
        if (this.view.paymentLock) {
          if (this.view.paymentLock.payerId === 'usr_me') {
            this.view.wallet.balanceTokens += this.view.paymentLock.tokens;
          }
          this.view.paymentLock = null;
        }
        this.view.room.gameId = null;
        this.recomputeState();
        break;
      }

      case 'START_GAME': {
        if (this.view.permissions.canStartGame) {
          this.view.room.phase = 'playing';
          this.recomputeState();
        }
        break;
      }

      case 'CLAIM_HOST': {
        this.view.me.isHost = true;
        this.view.room.players = this.view.room.players.map((p) => ({
          ...p,
          isHost: p.id === 'usr_me',
        }));
        this.recomputeState();
        break;
      }

      case 'REENTRY': {
        this.view.room.reentryDecisionNeeded = false;
        if (cmd.decision === 'resume') {
          this.view.room.phase = 'playing';
        } else {
          this.view.room.phase = 'lobby';
          this.view.room.gameId = null;
          this.view.paymentLock = null;
        }
        this.recomputeState();
        break;
      }

      case 'LEAVE_GAME': {
        if (this.view.room.phase === 'playing') {
          this.view.room.phase = 'finished';
          // Assign mock scores
          this.view.room.players = this.view.room.players.map((p, idx) => ({
            ...p,
            score: 100 - idx * 15,
          }));
        } else {
          this.view.me.isInRoom = false;
          this.view.room.players = this.view.room.players.filter((p) => p.id !== 'usr_me');
        }
        this.recomputeState();
        break;
      }

      case 'PLAY_AGAIN': {
        this.view.room.phase = 'playing';
        this.recomputeState();
        break;
      }

      case 'CHOOSE_ANOTHER': {
        this.view.room.phase = 'lobby';
        this.view.room.gameId = null;
        this.view.paymentLock = null;
        this.recomputeState();
        break;
      }

      case 'BUY_PACKAGE': {
        const pkg = this.view.topupPackages.find((p) => p.id === cmd.packageId);
        if (!pkg) return;

        this.view.busy = true;
        this.notify();

        setTimeout(() => {
          this.view.busy = false;
          this.view.wallet.balanceTokens += pkg.tokens;
          this.recomputeState();
        }, 1200);
        break;
      }

      case 'OPEN_CHANNEL': {
        // Simulated opening Telegram channel
        break;
      }

      case 'RECHECK_CHANNEL': {
        this.view.busy = true;
        this.notify();

        setTimeout(() => {
          this.view.busy = false;
          this.view.isChannelMember = true;
          this.recomputeState();
        }, 800);
        break;
      }

      case 'SET_PREFS': {
        if (cmd.theme) this.view.prefs.theme = cmd.theme;
        if (cmd.haptics !== undefined) this.view.prefs.haptics = cmd.haptics;
        this.notify();
        break;
      }
    }
  }

  // --- Dev Helpers & Live Simulation ---

  public setCustomView(customView: PlatformView): void {
    this.view = { ...customView };
    this.notify();
  }

  public resetParty(playerCount = 5): void {
    const mePlayer: PlatformPlayer = {
      id: 'usr_me',
      name: 'Андрей',
      isHost: false,
      status: 'here',
    };

    const initialOtherPlayers: PlatformPlayer[] = [
      { id: 'usr_2', name: 'Мария', isHost: true, status: 'here' },
      { id: 'usr_3', name: 'Артём', isHost: false, status: 'here' },
      { id: 'usr_4', name: 'Елена', isHost: false, status: 'here' },
      { id: 'usr_5', name: 'Константин', isHost: false, status: 'here' },
      { id: 'usr_6', name: 'Ольга', isHost: false, status: 'here' },
    ];

    const players = [mePlayer, ...initialOtherPlayers.slice(0, Math.max(0, playerCount - 1))];

    this.view = {
      ...this.view,
      context: 'group',
      isChannelMember: true,
      room: {
        id: 'room_party_442',
        phase: 'lobby',
        gameId: null,
        players,
        joinUrl: 'https://t.me/nastolki_bot/app?startapp=room_party_442',
        reentryDecisionNeeded: false,
      },
      me: {
        isInRoom: true,
        isHost: false,
      },
      paymentLock: null,
      error: null,
      busy: false,
    };
    this.recomputeState();
  }

  public toggleHostAway(): void {
    const host = this.view.room.players.find((p) => p.isHost);
    if (host) {
      host.status = host.status === 'away' ? 'here' : 'away';
      this.recomputeState();
    }
  }

  public simulateOtherPlayerTakeover(): void {
    // Another player pays for game and takes over host
    const otherPlayer = this.view.room.players.find((p) => p.id !== 'usr_me');
    if (!otherPlayer) return;

    if (this.view.paymentLock && this.view.paymentLock.payerId === 'usr_me') {
      // Refund me
      this.view.wallet.balanceTokens += this.view.paymentLock.tokens;
    }

    this.view.paymentLock = {
      payerId: otherPlayer.id,
      tokens: 10,
    };
    this.view.room.gameId = 'guesser';
    this.view.me.isHost = false;
    this.view.room.players = this.view.room.players.map((p) => ({
      ...p,
      isHost: p.id === otherPlayer.id,
    }));
    this.recomputeState();
  }

  public addPlayer(name?: string): void {
    const names = ['Даша', 'Максим', 'Сергей', 'Полина', 'Глеб', 'Алиса', 'Ярослав'];
    const randomName = name || names[this.view.room.players.length % names.length];
    const newPlayer: PlatformPlayer = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: randomName,
      isHost: false,
      status: 'here',
    };
    this.view.room.players.push(newPlayer);
    this.recomputeState();
  }

  public removePlayer(): void {
    if (this.view.room.players.length > 1) {
      const removed = this.view.room.players.pop();
      if (removed?.id === 'usr_me') {
        this.view.me.isInRoom = false;
        this.view.me.isHost = false;
      }
      this.recomputeState();
    }
  }

  public adjustBalance(delta: number): void {
    this.view.wallet.balanceTokens = Math.max(0, this.view.wallet.balanceTokens + delta);
    this.recomputeState();
  }

  public toggleAutoArrivals(): boolean {
    if (this.isSimulatingArrivals) {
      if (this.autoJoinTimer) clearInterval(this.autoJoinTimer);
      this.isSimulatingArrivals = false;
      return false;
    } else {
      this.isSimulatingArrivals = true;
      this.autoJoinTimer = setInterval(() => {
        if (this.view.room.players.length < 12) {
          this.addPlayer();
        } else {
          if (this.autoJoinTimer) clearInterval(this.autoJoinTimer);
          this.isSimulatingArrivals = false;
        }
      }, 3500);
      return true;
    }
  }

  private calculateGamesForPlayers(games: PlatformGame[], count: number): PlatformGame[] {
    return games.map((game) => ({
      ...game,
      priceForCurrentPlayers: calculateGamePrice(game, count),
    }));
  }

  private recomputeState(): void {
    const selectedGame = this.view.games.find((g) => g.id === this.view.room.gameId) || null;
    const playerCount = this.view.room.players.length;

    // Recalculate price in games
    this.view.games = this.calculateGamesForPlayers(INITIAL_GAMES, playerCount);

    // Compute permissions
    this.view.permissions = computePermissions({
      isInRoom: this.view.me.isInRoom,
      isHost: this.view.me.isHost,
      roomPhase: this.view.room.phase,
      gameId: this.view.room.gameId,
      players: this.view.room.players,
      selectedGame,
      balanceTokens: this.view.wallet.balanceTokens,
    });

    this.notify();
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener({ ...this.view });
    }
  }
}
