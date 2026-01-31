import type { Stage, TransitionType } from '../types';

export const COLORS = {
  // Стадии
  stages: {
    aesthetic: '#a78bfa',    // фиолетовый
    ethical: '#60a5fa',      // синий
    religious: '#fbbf24',    // золотой
  } as Record<Stage, string>,

  // Типы связей
  connections: {
    evolution: '#6b7280',    // серый (плавный переход)
    crisis: '#ef4444',       // красный (кризис)
    branch: '#f97316',       // оранжевый (развилка)
  } as Record<TransitionType, string>,

  // Оси
  axes: {
    finiteInfinite: '#ff6b6b',
    necessityPossibility: '#4ecdc4',
    consciousness: '#ffe66d',
  },

  // Зоны отчаяния (полупрозрачные)
  zones: {
    infinite: 'rgba(255, 107, 107, 0.1)',
    finite: 'rgba(255, 107, 107, 0.1)',
    possibility: 'rgba(78, 205, 196, 0.1)',
    necessity: 'rgba(78, 205, 196, 0.1)',
    unconscious: 'rgba(255, 230, 109, 0.1)',
    conscious: 'rgba(255, 230, 109, 0.1)',
  },

  // Фон
  background: '#0f172a',     // тёмно-синий

  // UI
  ui: {
    text: 'rgba(255, 255, 255, 0.87)',
    textMuted: 'rgba(255, 255, 255, 0.6)',
    border: 'rgba(255, 255, 255, 0.1)',
    surface: '#1e293b',
    surfaceHover: '#334155',
  },
};

export const getStageColor = (stage: Stage): string => {
  return COLORS.stages[stage] || COLORS.stages.aesthetic;
};

export const getConnectionColor = (type: TransitionType): string => {
  return COLORS.connections[type] || COLORS.connections.evolution;
};

// Размер точки зависит от осознанности
export const getPointSize = (consciousness: number): number => {
  // Чем выше осознанность, тем больше точка
  return 0.03 + consciousness * 0.04; // от 0.03 до 0.07
};

// Прозрачность зависит от того, выбран ли персонаж
export const getPointOpacity = (isSelected: boolean, isHovered: boolean): number => {
  if (isSelected) return 1;
  if (isHovered) return 0.8;
  return 0.5;
};

// Генерация случайного цвета для нового персонажа
export const generateCharacterColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 60%)`;
};

// Предустановленные цвета для персонажей
export const CHARACTER_COLORS = [
  '#ef4444', // красный
  '#f97316', // оранжевый
  '#eab308', // жёлтый
  '#22c55e', // зелёный
  '#14b8a6', // бирюзовый
  '#3b82f6', // синий
  '#8b5cf6', // фиолетовый
  '#ec4899', // розовый
];
