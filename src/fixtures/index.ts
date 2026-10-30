/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlatformView } from '../types';
import { INITIAL_GAMES, INITIAL_PACKAGES } from '../api/MockAdapter';

export interface FixtureMeta {
  id: string;
  name: string;
  category: 'screens' | 'perspectives' | 'edge_cases' | 'system';
  description: string;
  view: PlatformView;
}

const basePlayers = [
  { id: 'usr_me', name: 'Андрей', isHost: false, status: 'here' as const },
  { id: 'usr_2', name: 'Мария', isHost: true, status: 'here' as const },
  { id: 'usr_3', name: 'Артём', isHost: false, status: 'here' as const },
  { id: 'usr_4', name: 'Елена', isHost: false, status: 'here' as const },
  { id: 'usr_5', name: 'Константин', isHost: false, status: 'here' as const },
];

const baseView: PlatformView = {
  context: 'group',
  isChannelMember: true,
  channelUsername: 'nastolki_official',
  user: { id: 'usr_me', name: 'Андрей' },
  chat: { title: 'Клуб настолок СПб 🎲', membersCount: 16 },
  room: {
    id: 'room_party_442',
    phase: 'lobby',
    gameId: null,
    players: basePlayers,
    joinUrl: 'https://t.me/nastolki_bot/app?startapp=room_party_442',
    reentryDecisionNeeded: false,
  },
  me: { isInRoom: true, isHost: false },
  permissions: {
    canJoinRoom: false,
    canChooseGame: true,
    canPayForGame: false,
    canStartGame: false,
    canClaimHost: false,
  },
  wallet: { balanceTokens: 35 },
  paymentLock: null,
  games: INITIAL_GAMES,
  topupPackages: INITIAL_PACKAGES,
  prefs: { theme: 'telegram', haptics: true },
  busy: false,
  error: null,
};

export const FIXTURES: FixtureMeta[] = [
  // 1. G1 Gathering
  {
    id: 'g1_gathering_member',
    name: 'G1: Сбор (Игрок в комнате)',
    category: 'screens',
    description: 'Игрок зашёл в комнату, видит QR, участников и кнопку перехода к каталогу',
    view: {
      ...baseView,
      room: { ...baseView.room, phase: 'lobby', gameId: null },
      me: { isInRoom: true, isHost: false },
    },
  },
  {
    id: 'g1_gathering_host',
    name: 'G1: Сбор (Ведущий)',
    category: 'perspectives',
    description: 'Ведущий видит комнату с короной и управляет сбором',
    view: {
      ...baseView,
      room: {
        ...baseView.room,
        phase: 'lobby',
        gameId: null,
        players: basePlayers.map((p) => ({ ...p, isHost: p.id === 'usr_me' })),
      },
      me: { isInRoom: true, isHost: true },
    },
  },
  {
    id: 'g1_gathering_guest',
    name: 'G1: Сбор (Не вошёл в комнату)',
    category: 'perspectives',
    description: 'Открыл Mini App из чата, но ещё не нажал «Присоединиться»',
    view: {
      ...baseView,
      room: {
        ...baseView.room,
        phase: 'lobby',
        gameId: null,
        players: basePlayers.filter((p) => p.id !== 'usr_me'),
      },
      me: { isInRoom: false, isHost: false },
      permissions: { ...baseView.permissions, canJoinRoom: true, canChooseGame: false },
    },
  },
  {
    id: 'g1_no_qr',
    name: 'G1: QR недоступен',
    category: 'edge_cases',
    description: 'joinUrl отсутствует (сервер не сгенерировал ссылку)',
    view: {
      ...baseView,
      room: { ...baseView.room, joinUrl: null },
    },
  },
  {
    id: 'g1_30_players',
    name: 'G1: Максимум (30 игроков)',
    category: 'edge_cases',
    description: 'Большая вечеринка из 30 человек за столом',
    view: {
      ...baseView,
      room: {
        ...baseView.room,
        players: Array.from({ length: 30 }, (_, i) => ({
          id: `usr_${i}`,
          name: i === 0 ? 'Андрей (Вы)' : `Гость #${i + 1} Длиннофамильный`,
          isHost: i === 0,
          status: 'here' as const,
        })),
      },
      chat: { title: 'Корпоративный турнир департамента IT и аналитики', membersCount: 52 },
    },
  },

  // 2. G2 Game Selection
  {
    id: 'g2_catalog_normal',
    name: 'G2: Выбор игры (Каталог)',
    category: 'screens',
    description: 'Витрина игр с ценами для 5 игроков, баланс достаточен',
    view: {
      ...baseView,
      room: { ...baseView.room, phase: 'lobby', gameId: null },
      permissions: { ...baseView.permissions, canChooseGame: true, canPayForGame: true },
    },
  },
  {
    id: 'g2_zero_balance',
    name: 'G2: Нулевой баланс',
    category: 'edge_cases',
    description: '0 жетонов на балансе: платные игры заблокированы, квиз доступен',
    view: {
      ...baseView,
      wallet: { balanceTokens: 0 },
      permissions: { ...baseView.permissions, canPayForGame: false },
    },
  },
  {
    id: 'g2_too_few_players',
    name: 'G2: Мало игроков (2 человека)',
    category: 'edge_cases',
    description: 'В комнате только 2 человека: Угадайка и Бункер недоступны («нужно мин. 4»)',
    view: {
      ...baseView,
      room: {
        ...baseView.room,
        players: [
          { id: 'usr_me', name: 'Андрей', isHost: true, status: 'here' },
          { id: 'usr_2', name: 'Мария', isHost: false, status: 'here' },
        ],
      },
    },
  },

  // 3. G3 Lobby
  {
    id: 'g3_lobby_host_ready',
    name: 'G3: Лобби (Ведущий, готов к старту)',
    category: 'screens',
    description: 'Игра оплачена ведущим, игроков достаточно, кнопка «Начать игру» активна',
    view: {
      ...baseView,
      room: {
        ...baseView.room,
        phase: 'lobby',
        gameId: 'guesser',
        players: basePlayers.map((p) => ({ ...p, isHost: p.id === 'usr_me' })),
      },
      me: { isInRoom: true, isHost: true },
      paymentLock: { payerId: 'usr_me', tokens: 10 },
      permissions: { ...baseView.permissions, canStartGame: true },
    },
  },
  {
    id: 'g3_lobby_host_few_players',
    name: 'G3: Лобби (Ведущий, не хватает игроков)',
    category: 'edge_cases',
    description: 'Ведущий оплатил «Бункер» (нужно 6), а в комнате только 4 человека',
    view: {
      ...baseView,
      room: {
        ...baseView.room,
        phase: 'lobby',
        gameId: 'bunker',
        players: basePlayers.slice(0, 4).map((p) => ({ ...p, isHost: p.id === 'usr_me' })),
      },
      me: { isInRoom: true, isHost: true },
      paymentLock: { payerId: 'usr_me', tokens: 15 },
      permissions: { ...baseView.permissions, canStartGame: false },
    },
  },
  {
    id: 'g3_lobby_player',
    name: 'G3: Лобби (Обычный игрок)',
    category: 'perspectives',
    description: 'Обычный игрок ждёт, пока ведущий запустит партию',
    view: {
      ...baseView,
      room: { ...baseView.room, phase: 'lobby', gameId: 'gangsters' },
      me: { isInRoom: true, isHost: false },
      paymentLock: { payerId: 'usr_2', tokens: 12 },
    },
  },
  {
    id: 'g3_lobby_host_away',
    name: 'G3: Лобби (Ведущий пропал ~1.5 мин)',
    category: 'perspectives',
    description: 'Ведущий «не в сети», игроки видят кнопку «Стать ведущим»',
    view: {
      ...baseView,
      room: {
        ...baseView.room,
        phase: 'lobby',
        gameId: 'guesser',
        players: basePlayers.map((p) => (p.id === 'usr_2' ? { ...p, status: 'away' as const } : p)),
      },
      me: { isInRoom: true, isHost: false },
      permissions: { ...baseView.permissions, canClaimHost: true },
    },
  },
  {
    id: 'g3_price_changed',
    name: 'G3: Цена изменилась (ошибка)',
    category: 'edge_cases',
    description: 'Пришли новые участники, требуется перерасчёт перед стартом',
    view: {
      ...baseView,
      room: { ...baseView.room, phase: 'lobby', gameId: 'guesser' },
      me: { isInRoom: true, isHost: true },
      error: { code: 'PRICE_CHANGED', message: 'Цена изменилась: игроков в комнате стало больше.' },
    },
  },

  // 4. G4 Party
  {
    id: 'g4_party_guesser',
    name: 'G4: Партия (Угадайка)',
    category: 'screens',
    description: 'Идёт игра «Угадайка» в нейтральной рамке платформы со слотом',
    view: {
      ...baseView,
      room: { ...baseView.room, phase: 'playing', gameId: 'guesser' },
      me: { isInRoom: true, isHost: true },
    },
  },
  {
    id: 'g4_party_gangsters',
    name: 'G4: Партия (Гангстеры)',
    category: 'screens',
    description: 'Идёт игра «Гангстеры» в слоте платформы',
    view: {
      ...baseView,
      room: { ...baseView.room, phase: 'playing', gameId: 'gangsters' },
      me: { isInRoom: true, isHost: false },
    },
  },

  // 5. G5 Finished
  {
    id: 'g5_finished_host',
    name: 'G5: Итоги (Ведущий)',
    category: 'screens',
    description: 'Партия без своего финала завершена, ведущий выбирает дальнейшее действие',
    view: {
      ...baseView,
      room: {
        ...baseView.room,
        phase: 'finished',
        gameId: 'quiz_express',
        players: [
          { id: 'usr_me', name: 'Андрей', isHost: true, status: 'here', score: 94 },
          { id: 'usr_2', name: 'Мария', isHost: false, status: 'here', score: 88 },
          { id: 'usr_3', name: 'Артём', isHost: false, status: 'here', score: 72 },
          { id: 'usr_4', name: 'Елена', isHost: false, status: 'here', score: 65 },
        ],
      },
      me: { isInRoom: true, isHost: true },
    },
  },

  // 6. System & Edge Screens
  {
    id: 'sys_no_telegram',
    name: 'Система: Нет Telegram',
    category: 'system',
    description: 'Открыто в обычном веб-браузере вне клиента Telegram',
    view: {
      ...baseView,
      context: 'no_telegram',
    },
  },
  {
    id: 'sys_private_chat',
    name: 'Система: Не тот чат (личка)',
    category: 'system',
    description: 'Открыто в личном диалоге с ботом, инструкция по созданию группы',
    view: {
      ...baseView,
      context: 'private',
    },
  },
  {
    id: 'sys_no_subscription',
    name: 'Система: Нет подписки',
    category: 'system',
    description: 'Требуется подписка на канал проекта',
    view: {
      ...baseView,
      isChannelMember: false,
    },
  },
  {
    id: 'sys_network_error',
    name: 'Система: Ошибка сети / техработы',
    category: 'system',
    description: 'Сообщение об ошибке соединения с кнопкой повтора',
    view: {
      ...baseView,
      error: { code: 'NETWORK', message: 'Не удалось установить соединение с сервером.' },
    },
  },
  {
    id: 'sys_reentry_needed',
    name: 'Система: Комната опустела',
    category: 'edge_cases',
    description: 'Все игроки выходили из комнаты, диалог «Продолжить / Новая»',
    view: {
      ...baseView,
      room: { ...baseView.room, reentryDecisionNeeded: true },
    },
  },
  {
    id: 'sys_latecomer_game_in_progress',
    name: 'Система: Опоздавший (игра идёт)',
    category: 'edge_cases',
    description: 'Пользователь пытается войти, когда партия уже запущена',
    view: {
      ...baseView,
      room: { ...baseView.room, phase: 'playing', gameId: 'guesser' },
      me: { isInRoom: false, isHost: false },
      error: { code: 'ROOM_NOT_JOINABLE', message: 'Партия уже идёт, вход закрыт. Дождись следующей партии.' },
    },
  },
];
