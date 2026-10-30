/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, QrCode, AlertCircle } from 'lucide-react';
import { TEXTS } from '../texts';
import { triggerHaptic } from '../utils/haptics';

interface QRCodeCardProps {
  joinUrl: string | null;
  membersInGroup: number | null;
  playersInGame: number;
  isLightMode: boolean;
  hapticsEnabled?: boolean;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({
  joinUrl,
  membersInGroup,
  playersInGame,
  isLightMode,
  hapticsEnabled = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!joinUrl) return;
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      triggerHaptic('light', hapticsEnabled);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      data-testid="platform-qr-code"
      className={`w-full rounded-3xl p-5 flex flex-col items-center border transition-all duration-200 shadow-sm ${
        isLightMode
          ? 'bg-white border-neutral-200/90 shadow-neutral-200/50'
          : 'bg-neutral-900/90 border-neutral-800 shadow-black/40'
      }`}
    >
      {/* Group & In-Game Counter Badge */}
      <div
        className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold mb-4 border flex items-center gap-2 ${
          isLightMode
            ? 'bg-amber-50 text-amber-900 border-amber-200/70'
            : 'bg-amber-950/40 text-amber-200 border-amber-800/60'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>
          {TEXTS.gathering.groupStats(membersInGroup ?? playersInGame, playersInGame)}
        </span>
      </div>

      {/* QR Code Container (Large, legible across room) */}
      {joinUrl ? (
        <div className="relative p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-md flex items-center justify-center">
          <svg
            className="w-48 h-48 sm:w-56 sm:h-56 text-neutral-900"
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="QR код для входа в игровую комнату"
          >
            {/* Corner 1: Top-Left Finder */}
            <rect x="10" y="10" width="40" height="40" rx="6" fill="#18181b" />
            <rect x="18" y="18" width="24" height="24" rx="3" fill="#ffffff" />
            <rect x="24" y="24" width="12" height="12" rx="2" fill="#18181b" />

            {/* Corner 2: Top-Right Finder */}
            <rect x="110" y="10" width="40" height="40" rx="6" fill="#18181b" />
            <rect x="118" y="18" width="24" height="24" rx="3" fill="#ffffff" />
            <rect x="124" y="24" width="12" height="12" rx="2" fill="#18181b" />

            {/* Corner 3: Bottom-Left Finder */}
            <rect x="10" y="110" width="40" height="40" rx="6" fill="#18181b" />
            <rect x="18" y="118" width="24" height="24" rx="3" fill="#ffffff" />
            <rect x="24" y="124" width="12" height="12" rx="2" fill="#18181b" />

            {/* QR Pattern decorative data blocks */}
            <rect x="60" y="14" width="10" height="10" rx="2" fill="#18181b" />
            <rect x="80" y="14" width="16" height="10" rx="2" fill="#18181b" />
            <rect x="64" y="32" width="26" height="10" rx="2" fill="#18181b" />
            <rect x="14" y="64" width="10" height="18" rx="2" fill="#18181b" />
            <rect x="32" y="64" width="18" height="10" rx="2" fill="#18181b" />
            <rect x="60" y="60" width="40" height="40" rx="8" fill="#d97706" />
            <circle cx="80" cy="80" r="10" fill="#ffffff" />
            <rect x="76" y="76" width="8" height="8" rx="2" fill="#d97706" />

            <rect x="110" y="64" width="18" height="10" rx="2" fill="#18181b" />
            <rect x="136" y="72" width="14" height="22" rx="2" fill="#18181b" />
            <rect x="64" y="114" width="20" height="10" rx="2" fill="#18181b" />
            <rect x="94" y="114" width="10" height="22" rx="2" fill="#18181b" />
            <rect x="114" y="110" width="16" height="10" rx="2" fill="#18181b" />
            <rect x="138" y="120" width="12" height="24" rx="2" fill="#18181b" />
            <rect x="64" y="136" width="20" height="14" rx="2" fill="#18181b" />
            <rect x="114" y="132" width="16" height="16" rx="2" fill="#18181b" />
          </svg>
        </div>
      ) : (
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col items-center justify-center p-4 text-center">
          <AlertCircle className="w-10 h-10 text-amber-500 mb-2" />
          <span className="font-bold text-[15px] text-neutral-800 dark:text-neutral-200">
            {TEXTS.gathering.qrUnavailable}
          </span>
          <span className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-1">
            Сервер пока не выдал ссылку на комнату
          </span>
        </div>
      )}

      {/* Instruction text */}
      <p className="text-center text-[13.5px] font-medium text-neutral-500 dark:text-neutral-400 mt-3 max-w-[280px]">
        {TEXTS.gathering.scanHint}
      </p>

      {/* Copy link button */}
      {joinUrl && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? TEXTS.gathering.copiedLink : TEXTS.gathering.copyLink}
          className={`mt-4 h-11 px-5 rounded-xl text-[14px] font-semibold flex items-center gap-2 border transition-all active:scale-95 ${
            copied
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : isLightMode
              ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200/90'
              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
              <span>{TEXTS.gathering.copiedLink}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>{TEXTS.gathering.copyLink}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
