/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VisualStyle = 'cozy' | 'fiesta' | 'arcade';

export interface StyleTokens {
  id: VisualStyle;
  name: string;
  description: string;
  primaryBg: string;
  primaryHover: string;
  primaryText: string;
  accentBg: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  cardBgLight: string;
  cardBgDark: string;
  headerBorderLight: string;
  headerBorderDark: string;
}

export const VISUAL_STYLES: Record<VisualStyle, StyleTokens> = {
  cozy: {
    id: 'cozy',
    name: 'Тёплый вечер (Tabletop)',
    description: 'Уютный вечер настолок с друзьями: тёплый янтарь, терракота, деревянные оттенки.',
    primaryBg: 'bg-amber-600 dark:bg-amber-500',
    primaryHover: 'hover:bg-amber-700 dark:hover:bg-amber-400 active:bg-amber-800',
    primaryText: 'text-white dark:text-neutral-950 font-semibold',
    accentBg: 'bg-amber-50 dark:bg-amber-950/40',
    accentBorder: 'border-amber-200 dark:border-amber-800/60',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200',
    badgeText: 'text-amber-800 dark:text-amber-200',
    cardBgLight: 'bg-amber-50/50 border-amber-200/60 shadow-amber-950/5',
    cardBgDark: 'bg-neutral-900/90 border-neutral-800 shadow-black/40',
    headerBorderLight: 'border-amber-200/50',
    headerBorderDark: 'border-neutral-800/80',
  },
  fiesta: {
    id: 'fiesta',
    name: 'Праздник (Fiesta)',
    description: 'Яркая игровая вечеринка: сочный коралл, роза, динамичные акценты.',
    primaryBg: 'bg-rose-600 dark:bg-rose-500',
    primaryHover: 'hover:bg-rose-700 dark:hover:bg-rose-400 active:bg-rose-800',
    primaryText: 'text-white dark:text-neutral-950 font-semibold',
    accentBg: 'bg-rose-50 dark:bg-rose-950/40',
    accentBorder: 'border-rose-200 dark:border-rose-800/60',
    badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200',
    badgeText: 'text-rose-800 dark:text-rose-200',
    cardBgLight: 'bg-white border-rose-200/60 shadow-rose-950/5',
    cardBgDark: 'bg-neutral-900/90 border-neutral-800 shadow-black/40',
    headerBorderLight: 'border-rose-200/50',
    headerBorderDark: 'border-neutral-800/80',
  },
  arcade: {
    id: 'arcade',
    name: 'Нео-аркада (Modern Clean)',
    description: 'Лаконичный технологичный стиль: индиго, фиолетовый, матовые стеклянные грани.',
    primaryBg: 'bg-indigo-600 dark:bg-indigo-500',
    primaryHover: 'hover:bg-indigo-700 dark:hover:bg-indigo-400 active:bg-indigo-800',
    primaryText: 'text-white dark:text-neutral-950 font-semibold',
    accentBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    accentBorder: 'border-indigo-200 dark:border-indigo-800/60',
    badgeBg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200',
    badgeText: 'text-indigo-800 dark:text-indigo-200',
    cardBgLight: 'bg-white border-neutral-200 shadow-indigo-950/5',
    cardBgDark: 'bg-neutral-900/90 border-neutral-800 shadow-black/40',
    headerBorderLight: 'border-neutral-200',
    headerBorderDark: 'border-neutral-800',
  },
};
