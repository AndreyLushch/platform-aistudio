/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';
import { PlatformView } from '../types';
import { TEXTS } from '../texts';
import { QRCodeCard } from '../components/QRCodeCard';

interface InviteSheetProps {
  isOpen: boolean;
  onClose: () => void;
  view: PlatformView;
  isLightMode: boolean;
}

export const InviteSheet: React.FC<InviteSheetProps> = ({
  isOpen,
  onClose,
  view,
  isLightMode,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-sheet-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
    >
      <div
        className={`w-full max-w-[430px] rounded-t-3xl p-5 pb-[calc(20px+var(--sab))] flex flex-col border-t transition-colors shadow-2xl ${
          isLightMode
            ? 'bg-white border-neutral-200 text-neutral-900'
            : 'bg-neutral-900 border-neutral-800 text-white'
        }`}
      >
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-neutral-200/60 dark:border-neutral-800">
          <div>
            <h2 id="invite-sheet-title" className="font-extrabold text-[17px] tracking-tight">
              {TEXTS.inviteSheet.title}
            </h2>
            <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              {TEXTS.inviteSheet.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <QRCodeCard
          joinUrl={view.room.joinUrl}
          membersInGroup={view.chat.membersCount}
          playersInGame={view.room.players.length}
          isLightMode={isLightMode}
          hapticsEnabled={view.prefs.haptics}
        />

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full h-12 rounded-2xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 font-bold text-[14.5px] text-neutral-800 dark:text-neutral-200 transition-colors"
        >
          Готово
        </button>
      </div>
    </div>
  );
};
