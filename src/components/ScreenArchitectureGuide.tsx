/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Layout, Layers, ShieldCheck, Sparkles, Smartphone, Users } from 'lucide-react';
import { FIXTURES, FixtureMeta } from '../fixtures';

interface ScreenArchitectureGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFixture: (fixture: FixtureMeta) => void;
  activeFixtureId?: string;
  isLightMode: boolean;
}

export const ScreenArchitectureGuide: React.FC<ScreenArchitectureGuideProps> = ({
  isOpen,
  onClose,
  onSelectFixture,
  activeFixtureId,
  isLightMode,
}) => {
  if (!isOpen) return null;

  const screens = FIXTURES.filter((f) => f.category === 'screens');
  const perspectives = FIXTURES.filter((f) => f.category === 'perspectives');
  const edgeCases = FIXTURES.filter((f) => f.category === 'edge_cases');
  const system = FIXTURES.filter((f) => f.category === 'system');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="arch-guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-in fade-in"
    >
      <div
        className={`w-full max-w-lg max-h-[90vh] rounded-3xl p-5 flex flex-col border shadow-2xl overflow-hidden ${
          isLightMode
            ? 'bg-white border-neutral-200 text-neutral-900'
            : 'bg-neutral-900 border-neutral-800 text-white'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-amber-500" />
            <h2 id="arch-guide-title" className="font-extrabold text-[17px] tracking-tight">
              Карта архитектуры экранов
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

        {/* Scrollable Content Grid */}
        <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-5 pr-1">
          {/* Main Screens */}
          <div>
            <h3 className="text-[13.5px] font-bold text-amber-600 dark:text-amber-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Основные экраны (G1 – G5)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {screens.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    onSelectFixture(f);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    activeFixtureId === f.id
                      ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-200 shadow-xs'
                      : isLightMode
                      ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/80 text-neutral-800'
                      : 'bg-neutral-800/50 hover:bg-neutral-800 border-neutral-700/60 text-neutral-200'
                  }`}
                >
                  <span className="font-bold text-[14px] block leading-tight">{f.name}</span>
                  <span className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-1 block leading-snug">
                    {f.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Perspectives */}
          <div>
            <h3 className="text-[13.5px] font-bold text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>Ракурсы участников</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {perspectives.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    onSelectFixture(f);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    activeFixtureId === f.id
                      ? 'bg-indigo-500/15 border-indigo-500 text-indigo-900 dark:text-indigo-200 shadow-xs'
                      : isLightMode
                      ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/80 text-neutral-800'
                      : 'bg-neutral-800/50 hover:bg-neutral-800 border-neutral-700/60 text-neutral-200'
                  }`}
                >
                  <span className="font-bold text-[14px] block leading-tight">{f.name}</span>
                  <span className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-1 block leading-snug">
                    {f.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Edge Cases */}
          <div>
            <h3 className="text-[13.5px] font-bold text-rose-600 dark:text-rose-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Крайние случаи и защита</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {edgeCases.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    onSelectFixture(f);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    activeFixtureId === f.id
                      ? 'bg-rose-500/15 border-rose-500 text-rose-900 dark:text-rose-200 shadow-xs'
                      : isLightMode
                      ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/80 text-neutral-800'
                      : 'bg-neutral-800/50 hover:bg-neutral-800 border-neutral-700/60 text-neutral-200'
                  }`}
                >
                  <span className="font-bold text-[14px] block leading-tight">{f.name}</span>
                  <span className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-1 block leading-snug">
                    {f.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* System Screens */}
          <div>
            <h3 className="text-[13.5px] font-bold text-teal-600 dark:text-teal-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" />
              <span>Системные проверки Telegram</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {system.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    onSelectFixture(f);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    activeFixtureId === f.id
                      ? 'bg-teal-500/15 border-teal-500 text-teal-900 dark:text-teal-200 shadow-xs'
                      : isLightMode
                      ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/80 text-neutral-800'
                      : 'bg-neutral-800/50 hover:bg-neutral-800 border-neutral-700/60 text-neutral-200'
                  }`}
                >
                  <span className="font-bold text-[14px] block leading-tight">{f.name}</span>
                  <span className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-1 block leading-snug">
                    {f.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
