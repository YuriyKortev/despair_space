import type { Character } from '../types';
import type { TranslationStrings } from '../i18n/types';

// Функция для создания пресета Раскольникова с локализацией
const createRaskolnikovPreset = (t: TranslationStrings): Character => ({
  id: 'raskolnikov',
  name: t.presets.raskolnikov.name,
  color: '#ef4444',
  core: {
    history: t.presets.raskolnikov.core.history,
    body: t.presets.raskolnikov.core.body,
    gift: t.presets.raskolnikov.core.gift,
  },
  rootPointId: 'r1',
  points: [
    {
      id: 'r1',
      momentName: t.presets.raskolnikov.points.r1.momentName,
      vector: {
        finiteInfinite: 0.9,
        necessityPossibility: 0.8,
        consciousness: 0.4,
      },
      stage: 'aesthetic',
      stageSubtype: 'intellectual',
      axisSubtypes: {
        infinityType: 'cognition',
        possibilityType: 'paralyzed',
      },
      label: t.presets.raskolnikov.points.r1.label,
      description: t.presets.raskolnikov.points.r1.description,
    },
    {
      id: 'r2',
      momentName: t.presets.raskolnikov.points.r2.momentName,
      vector: {
        finiteInfinite: 0.5,
        necessityPossibility: 0.3,
        consciousness: 0.7,
      },
      stage: 'aesthetic',
      stageSubtype: 'intellectual',
      label: t.presets.raskolnikov.points.r2.label,
      description: t.presets.raskolnikov.points.r2.description,
    },
    {
      id: 'r3',
      momentName: t.presets.raskolnikov.points.r3.momentName,
      vector: {
        finiteInfinite: 0.4,
        necessityPossibility: 0.5,
        consciousness: 0.8,
      },
      stage: 'ethical',
      stageSubtype: 'heroic',
      label: t.presets.raskolnikov.points.r3.label,
      description: t.presets.raskolnikov.points.r3.description,
    },
    {
      id: 'r4',
      momentName: t.presets.raskolnikov.points.r4.momentName,
      vector: {
        finiteInfinite: 0.3,
        necessityPossibility: 0.4,
        consciousness: 0.9,
      },
      stage: 'religious',
      stageSubtype: 'immanent',
      label: t.presets.raskolnikov.points.r4.label,
      description: t.presets.raskolnikov.points.r4.description,
    },
    {
      id: 'r5',
      momentName: t.presets.raskolnikov.points.r5.momentName,
      vector: {
        finiteInfinite: 0.2,
        necessityPossibility: 0.3,
        consciousness: 0.6,
      },
      stage: 'ethical',
      stageSubtype: 'civic',
      label: t.presets.raskolnikov.points.r5.label,
      description: t.presets.raskolnikov.points.r5.description,
    },
    {
      id: 'r6',
      momentName: t.presets.raskolnikov.points.r6.momentName,
      vector: {
        finiteInfinite: 0.5,
        necessityPossibility: 0.5,
        consciousness: 0.95,
      },
      stage: 'religious',
      stageSubtype: 'paradoxical',
      label: t.presets.raskolnikov.points.r6.label,
      description: t.presets.raskolnikov.points.r6.description,
    },
  ],
  connections: [
    {
      id: 'c1',
      fromPointId: 'r1',
      toPointId: 'r2',
      transitionType: 'crisis',
      crisis: {
        trigger: t.presets.raskolnikov.connections.c1.trigger,
        alternatives: t.presets.raskolnikov.connections.c1.alternatives,
      },
    },
    {
      id: 'c2',
      fromPointId: 'r2',
      toPointId: 'r3',
      transitionType: 'evolution',
    },
    {
      id: 'c3',
      fromPointId: 'r3',
      toPointId: 'r4',
      transitionType: 'crisis',
      crisis: {
        trigger: t.presets.raskolnikov.connections.c3.trigger,
        alternatives: t.presets.raskolnikov.connections.c3.alternatives,
      },
    },
    {
      id: 'c4',
      fromPointId: 'r4',
      toPointId: 'r5',
      transitionType: 'evolution',
    },
    {
      id: 'c5',
      fromPointId: 'r5',
      toPointId: 'r6',
      transitionType: 'crisis',
      crisis: {
        trigger: t.presets.raskolnikov.connections.c5.trigger,
        alternatives: t.presets.raskolnikov.connections.c5.alternatives,
      },
    },
  ],
});

// Функция для получения локализованных пресетов
export const getPresetCharacters = (t: TranslationStrings): Character[] => [
  createRaskolnikovPreset(t),
];

// Функция для загрузки пресета в store
export const loadPresetCharacter = (presetId: string, t: TranslationStrings): Character | null => {
  const presets = getPresetCharacters(t);
  return presets.find((c) => c.id === presetId) || null;
};

export default getPresetCharacters;
