/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Wrench,
  ChevronUp,
  ChevronDown,
  Layers,
  Sparkles,
  UserCheck,
  Plus,
  Minus,
  RefreshCw,
  Sun,
  Moon,
  Smartphone,
  Palette,
  Gamepad2,
  Users,
  WifiOff,
  Coins,
} from 'lucide-react';
import { PlatformView } from '../types';
import { FIXTURES, FixtureMeta } from '../fixtures';
import { VisualStyle, VISUAL_STYLES } from '../theme/tokens';
import { GameSlotType } from './GameSlot';

interface DevPanelProps {
  currentView: PlatformView;
  isLiveMock: boolean;
  onApplyFixture: (fixture: FixtureMeta) => void;
  onResetLiveMock: (playerCount?: number) => void;
  onToggleHostAway: () => void;
  onSimulateOtherTakeover: () => void;
  onAddPlayer: () => void;
  onRemovePlayer: () => void;
  onToggleAutoArrivals: () => boolean;
  onAdjustBalance: (delta: number) => void;
  visualStyle: VisualStyle;
  onSetVisualStyle: (style: VisualStyle) => void;
  activeGameSlot: GameSlotType;
  onSetGameSlot: (slot: GameSlotType) => void;
  onOpenArchitectureGuide: () => void;
  onOpenProposals: () => void;
  isLightMode: boolean;
  onToggleTheme: () => void;
}

export const DevPanel: React.FC<DevPanelProps> = ({
  currentView,
  isLiveMock,
  onApplyFixture,
  onResetLiveMock,
  onToggleHostAway,
  onSimulateOtherTakeover,
  onAddPlayer,
  onRemovePlayer,
  onToggleAutoArrivals,
  onAdjustBalance,
  visualStyle,
  onSetVisualStyle,
  activeGameSlot,
  onSetGameSlot,
  onOpenArchitectureGuide,
  onOpenProposals,
  isLightMode,
  onToggleTheme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAutoArrivalActive, setIsAutoArrivalActive] = useState(false);

  const handleToggleAuto = () => {
    const active = onToggleAutoArrivals();
    setIsAutoArrivalActive(active);
  };

  return (
    <aside
      aria-label="Панель разработчика"
      className="fixed bottom-2 right-2 z-40 flex flex-col items-end max-w-[calc(100vw-16px)]"
    >
      {/* Floating Toggle Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 px-3.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold text-[13px] flex items-center gap-1.5 shadow-xl hover:scale-105 active:scale-95 transition-all border border-neutral-700/60"
      >
        <Wrench className="w-4 h-4 text-amber-400" />
        <span>DevPanel</span>
        {isLiveMock && (
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        )}
        {isOpen ? <ChevronDown className="w-4 h-4 ml-1" /> : <ChevronUp className="w-4 h-4 ml-1" />}
      </button>

      {/* Expanded Panel */}
      {isOpen && (
        <div
          className={`w-[360px] max-h-[82vh] overflow-y-auto mt-2 rounded-3xl p-4 border shadow-2xl flex flex-col gap-4 text-[13px] ${
            isLightMode
              ? 'bg-white/95 backdrop-blur-md border-neutral-300 text-neutral-900 shadow-neutral-900/20'
              : 'bg-neutral-950/95 backdrop-blur-md border-neutral-800 text-neutral-100 shadow-black'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-1.5 font-black text-[14px]">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Dev Controls & Fixtures</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onToggleTheme}
                className="px-2 py-1 rounded-lg border text-[12px] font-semibold flex items-center gap-1"
              >
                {isLightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                <span>{isLightMode ? 'Тёмная' : 'Светлая'}</span>
              </button>
            </div>
          </div>

          {/* Guide & Proposals Modals Shortcuts */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onOpenArchitectureGuide}
              className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-bold flex items-center justify-center gap-1.5"
            >
              <Layers className="w-4 h-4" />
              <span>Карта экранов</span>
            </button>
            <button
              type="button"
              onClick={onOpenProposals}
              className="p-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-800 dark:text-indigo-300 font-bold flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Предложения (п. 9)</span>
            </button>
          </div>

          {/* Visual Style (3 variants on G1, G2, G3 as per Requirement 7) */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-amber-500" />
              <span>Стиль оформления платформы:</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.keys(VISUAL_STYLES) as VisualStyle[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onSetVisualStyle(st)}
                  className={`py-1.5 px-1 rounded-xl text-[12px] font-bold border truncate transition-all ${
                    visualStyle === st
                      ? 'bg-amber-600 text-white border-amber-600'
                      : isLightMode
                      ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-800'
                      : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
                  }`}
                >
                  {st === 'cozy' ? 'Тёплый' : st === 'fiesta' ? 'Праздник' : 'Нео-аркада'}
                </button>
              ))}
            </div>
          </div>

          {/* Game Slot in G4 (Guesser, Gangsters, Empty) */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
              <Gamepad2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Слот игры (G4 Партия):</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => onSetGameSlot('guesser')}
                className={`py-1.5 px-1 rounded-xl text-[12px] font-bold border truncate transition-all ${
                  activeGameSlot === 'guesser'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
                }`}
              >
                🎭 Угадайка
              </button>
              <button
                type="button"
                onClick={() => onSetGameSlot('gangsters')}
                className={`py-1.5 px-1 rounded-xl text-[12px] font-bold border truncate transition-all ${
                  activeGameSlot === 'gangsters'
                    ? 'bg-neutral-900 text-white border-neutral-700'
                    : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
                }`}
              >
                🕵️ Гангстеры
              </button>
              <button
                type="button"
                onClick={() => onSetGameSlot('empty')}
                className={`py-1.5 px-1 rounded-xl text-[12px] font-bold border truncate transition-all ${
                  activeGameSlot === 'empty'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
                }`}
              >
                Пусто
              </button>
            </div>
          </div>

          {/* Quick Fixture Select */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-neutral-700 dark:text-neutral-300">
                Фикстура экрана:
              </label>
              {isLiveMock && (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  ● Живой мок
                </span>
              )}
            </div>
            <select
              aria-label="Фикстура экрана"
              onChange={(e) => {
                const target = FIXTURES.find((f) => f.id === e.target.value);
                if (target) onApplyFixture(target);
              }}
              value={isLiveMock ? '' : FIXTURES.find((f) => f.view === currentView)?.id || ''}
              className={`w-full h-10 px-3 rounded-xl border text-[13px] font-medium outline-hidden ${
                isLightMode
                  ? 'bg-neutral-100 border-neutral-300 text-neutral-900'
                  : 'bg-neutral-900 border-neutral-700 text-neutral-100'
              }`}
            >
              <option value="" disabled>
                {isLiveMock ? '— Выбери фикстуру для проверки —' : 'Фикстура активна'}
              </option>
              {FIXTURES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Live Mock Controls */}
          <div className="flex flex-col gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-700 dark:text-neutral-300">
                Живая модель мока:
              </span>
              <button
                type="button"
                onClick={() => onResetLiveMock(5)}
                className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold text-[12px] flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Сброс (5 игр.)
              </button>
            </div>

            {/* Players Add/Remove */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={onAddPlayer}
                className="h-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Игрок вошёл</span>
              </button>
              <button
                type="button"
                onClick={onRemovePlayer}
                className="h-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold flex items-center justify-center gap-1"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Игрок ушёл</span>
              </button>
            </div>

            {/* Auto Arrival Simulation */}
            <button
              type="button"
              onClick={handleToggleAuto}
              className={`h-9 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-all ${
                isAutoArrivalActive
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border-neutral-200 dark:border-neutral-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>
                {isAutoArrivalActive ? 'Авто-вход включен' : 'Авто-вход игроков (3.5с)'}
              </span>
            </button>

            {/* Host Away & Takeover */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={onToggleHostAway}
                className="h-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold flex items-center justify-center gap-1 text-[12.5px]"
              >
                <WifiOff className="w-3.5 h-3.5 text-rose-500" />
                <span>Ведущий пропал</span>
              </button>

              <button
                type="button"
                onClick={onSimulateOtherTakeover}
                className="h-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold flex items-center justify-center gap-1 text-[12.5px]"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Перехват оплаты</span>
              </button>
            </div>

            {/* Wallet Balance Adjust */}
            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>Баланс: {currentView.wallet.balanceTokens} 🪙</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onAdjustBalance(10)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold"
                >
                  +10
                </button>
                <button
                  type="button"
                  onClick={() => onAdjustBalance(-10)}
                  className="px-2.5 py-1 rounded-lg bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 font-bold"
                >
                  -10
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
