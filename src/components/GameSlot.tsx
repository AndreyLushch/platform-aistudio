/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Gamepad2, ShieldAlert } from 'lucide-react';
import { TEXTS } from '../texts';

export type GameSlotType = 'guesser' | 'gangsters' | 'empty';

interface GameSlotProps {
  slotType: GameSlotType;
  gameTitle?: string;
  isLightMode: boolean;
}

export const GameSlot: React.FC<GameSlotProps> = ({
  slotType,
  gameTitle = 'Игра',
  isLightMode,
}) => {
  if (slotType === 'guesser') {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-rose-500 via-rose-600 to-amber-500 text-white select-none">
        <div className="w-full max-w-sm flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-lg border border-white/30 animate-bounce">
            🎭
          </div>
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/25 text-[13px] font-black tracking-wider uppercase backdrop-blur-md mb-2">
              Слот игры: Угадайка (Fiesta)
            </span>
            <h2 className="text-2xl font-black tracking-tight drop-shadow-sm">
              Команда «Красные тигры»
            </h2>
            <p className="text-[14px] text-white/90 mt-1">
              Раунд 2 из 3 · Слово объясняет ведущий
            </p>
          </div>

          <div className="w-full bg-white/15 backdrop-blur-lg rounded-3xl p-5 border border-white/25 shadow-xl flex flex-col items-center gap-2 mt-2">
            <span className="text-[13px] font-bold text-white/80 uppercase">Текущее слово</span>
            <span className="text-3xl font-black tracking-wider">КОСМОНАВТ</span>
            <div className="flex items-center gap-3 mt-3">
              <span className="px-3 py-1.5 rounded-xl bg-white/20 text-[13px] font-bold">
                Счёт: 14 очков
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/20 text-[13px] font-bold">
                Осталось: 24 сек
              </span>
            </div>
          </div>

          <p className="text-[13px] text-white/80 max-w-xs mt-2">
            {TEXTS.party.gameSlotDesc}
          </p>
        </div>
      </div>
    );
  }

  if (slotType === 'gangsters') {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-6 bg-neutral-950 text-neutral-100 select-none border-t border-neutral-800">
        <div className="w-full max-w-sm flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-3xl shadow-xl">
            🕵️‍♂️
          </div>
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300 text-[13px] font-bold tracking-wider uppercase mb-2">
              Слот игры: Гангстеры (Noir Comic)
            </span>
            <h2 className="text-2xl font-black tracking-tight text-neutral-100 font-mono">
              ФАЗА: НОЧЬ В ЧИКАГО
            </h2>
            <p className="text-[14px] text-neutral-400 mt-1">
              Мафия выбирает жертву. Город засыпает.
            </p>
          </div>

          <div className="w-full bg-neutral-900/90 rounded-2xl p-5 border border-neutral-800 shadow-2xl flex flex-col items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-rose-500 animate-pulse" />
            <div className="text-center">
              <span className="text-[13px] font-bold text-neutral-400 uppercase tracking-widest block">
                Твоя тайная роль
              </span>
              <span className="text-xl font-black text-rose-500">БОСС МАФИИ</span>
            </div>
            <p className="text-[13px] text-neutral-400 mt-1">
              Договорись с сообщниками до рассвета.
            </p>
          </div>

          <p className="text-[13px] text-neutral-500 max-w-xs mt-2">
            {TEXTS.party.gameSlotDesc}
          </p>
        </div>
      </div>
    );
  }

  // Empty slot
  return (
    <div
      className={`w-full flex-1 flex flex-col items-center justify-center p-6 select-none ${
        isLightMode ? 'bg-neutral-50 text-neutral-700' : 'bg-neutral-950 text-neutral-300'
      }`}
    >
      <div className="w-full max-w-sm flex flex-col items-center text-center gap-3 border-2 border-dashed rounded-3xl p-8 border-neutral-300 dark:border-neutral-800">
        <Gamepad2 className="w-12 h-12 text-neutral-400" />
        <h3 className="font-bold text-[17px] text-neutral-800 dark:text-neutral-200">
          Слот игры «{gameTitle}» (Пусто)
        </h3>
        <p className="text-[13.5px] text-neutral-500 dark:text-neutral-400">
          {TEXTS.party.gameSlotDesc} В реальной интеграции сюда монтируется React-модуль игры.
        </p>
        <span className="text-[13px] font-medium text-amber-600 dark:text-amber-400">
          Переключить заглушку можно в DevPanel внизу
        </span>
      </div>
    </div>
  );
};
