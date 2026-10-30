/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Sparkles, PiggyBank, History, Trophy, Compass, PlusCircle } from 'lucide-react';

interface ProposalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLightMode: boolean;
}

export const PROPOSALS = [
  {
    id: 'crowdfund',
    icon: PiggyBank,
    title: '1. Складчина на партию (Crowdfunding)',
    summary: 'Возможность делить стоимость партии между всеми или добровольно скидываться жетонами.',
    benefits: 'Снижает финансовую нагрузку на одного человека, ускоряет запуск дорогих игр в больших компаниях.',
    requiredFields: 'PlatformView.room.crowdfund: { targetTokens: number; collectedTokens: number; contributors: { playerId: string; tokens: number }[] }',
    requiredCommands: "PlatformCommand: { type: 'CONTRIBUTE_TOKENS'; tokens: number } | { type: 'INIT_CROWDFUND' }",
  },
  {
    id: 'chat_history',
    icon: History,
    title: '2. История партий и статистика чата',
    summary: 'Хранение последних сыгранных партий чата с датами, победителями и продолжительностью.',
    benefits: 'Подогревает интерес к повторным играм, формирует культуру совместного досуга компании.',
    requiredFields: 'PlatformView.chatHistory?: Array<{ id: string; gameTitle: string; endedAt: string; winnerName: string; durationMin: number }>',
    requiredCommands: "PlatformCommand: { type: 'OPEN_CHAT_HISTORY' }",
  },
  {
    id: 'seasonal_cup',
    icon: Trophy,
    title: '3. Сезонный рейтинг компании (Лига чата)',
    summary: 'Таблица лидеров чата за месяц или сезон с начислением очков за победы и участие.',
    benefits: 'Высокое удержание компании, здоровая соревновательность для корпоративов и друзей.',
    requiredFields: 'PlatformView.leaderboard?: Array<{ rank: number; playerId: string; playerName: string; winsCount: number; points: number }>',
    requiredCommands: "PlatformCommand: { type: 'VIEW_LEADERBOARD' }",
  },
  {
    id: 'fast_onboarding',
    icon: Compass,
    title: '4. Экспресс-онбординг первого запуска',
    summary: '3 быстрых слайда с правилами работы платформы при первом открытии новичком.',
    benefits: 'Снимает страх и непонимание у новых участников, объясняет как работает QR и ведущий.',
    requiredFields: 'PlatformView.user.isFirstLaunch?: boolean',
    requiredCommands: "PlatformCommand: { type: 'COMPLETE_ONBOARDING' }",
  },
];

export const ProposalsModal: React.FC<ProposalsModalProps> = ({
  isOpen,
  onClose,
  isLightMode,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="proposals-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-in fade-in"
    >
      <div
        className={`w-full max-w-lg max-h-[90vh] rounded-3xl p-5 flex flex-col border shadow-2xl overflow-hidden ${
          isLightMode
            ? 'bg-white border-neutral-200 text-neutral-900'
            : 'bg-neutral-900 border-neutral-800 text-white'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 id="proposals-title" className="font-extrabold text-[17px] tracking-tight">
              Предложения сверх контракта (Раздел 9)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-4 pr-1">
          <p className="text-[13.5px] text-neutral-600 dark:text-neutral-400">
            Идеи для расширения платформы «Настолки» с описанием ценности для пользователей и точным контрактом расширения данных:
          </p>

          {PROPOSALS.map((prop) => {
            const Icon = prop.icon;
            return (
              <div
                key={prop.id}
                className={`p-4 rounded-2xl border flex flex-col gap-2 ${
                  isLightMode
                    ? 'bg-neutral-50/80 border-neutral-200'
                    : 'bg-neutral-800/40 border-neutral-700/70'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-[15px] text-neutral-900 dark:text-neutral-100">
                    {prop.title}
                  </h3>
                </div>

                <p className="text-[13.5px] text-neutral-700 dark:text-neutral-300">
                  {prop.summary}
                </p>

                <div className="text-[13px] text-emerald-700 dark:text-emerald-400 font-medium">
                  💡 Польза: {prop.benefits}
                </div>

                <div className="mt-1 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60 flex flex-col gap-1 font-mono text-[12.5px]">
                  <div className="text-amber-700 dark:text-amber-300">
                    <span className="font-bold">Поля:</span> {prop.requiredFields}
                  </div>
                  <div className="text-indigo-700 dark:text-indigo-300">
                    <span className="font-bold">Команды:</span> {prop.requiredCommands}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
