/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type HapticKind = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
      };
    };
  }
}

export function triggerHaptic(kind: HapticKind = 'light', enabled = true) {
  if (!enabled) return;

  try {
    const tgHaptic = window.Telegram?.WebApp?.HapticFeedback;
    if (tgHaptic) {
      if (kind === 'success' || kind === 'warning' || kind === 'error') {
        tgHaptic.notificationOccurred(kind);
      } else {
        tgHaptic.impactOccurred(kind);
      }
      return;
    }

    // Fallback: Web Vibration API
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      if (kind === 'heavy' || kind === 'error') {
        navigator.vibrate([30, 40, 30]);
      } else if (kind === 'medium' || kind === 'warning') {
        navigator.vibrate(25);
      } else {
        navigator.vibrate(12);
      }
    }
  } catch {
    // Ignore unsupported environments
  }
}
