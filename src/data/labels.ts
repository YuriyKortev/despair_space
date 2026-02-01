import type { DespairPoint, DespairVector } from '../types';
import type { TranslationStrings, TranslationDescriptions } from '../i18n/types';
import { ZONE_DESCRIPTIONS, STAGE_DESCRIPTIONS, STAGE_NAMES, SUBTYPE_NAMES } from './descriptions';

// ===== ГЕНЕРАЦИЯ ЛЕЙБЛОВ =====

interface LabelCondition {
  isInfinite?: boolean;
  isFinite?: boolean;
  isPossibility?: boolean;
  isNecessity?: boolean;
  isConscious?: boolean;
  isUnconscious?: boolean;
  isSemiconscious?: boolean;
}

interface LabelEntry {
  condition: LabelCondition;
  labelKey: keyof TranslationStrings['labels'];
}

const LABEL_MATRIX: LabelEntry[] = [
  // Бесконечность + Возможность
  {
    condition: { isInfinite: true, isPossibility: true, isUnconscious: true },
    labelKey: 'dreamerUnknowing',
  },
  {
    condition: { isInfinite: true, isPossibility: true, isConscious: true },
    labelKey: 'reflectionDevours',
  },
  {
    condition: { isInfinite: true, isPossibility: true, isSemiconscious: true },
    labelKey: 'grandPlansInFog',
  },

  // Конечность + Необходимость
  {
    condition: { isFinite: true, isNecessity: true, isUnconscious: true },
    labelKey: 'polishedPebble',
  },
  {
    condition: { isFinite: true, isNecessity: true, isConscious: true },
    labelKey: 'knowsCageAccepted',
  },
  {
    condition: { isFinite: true, isNecessity: true, isSemiconscious: true },
    labelKey: 'vaguelyFeelsWalls',
  },

  // Бесконечность + Необходимость
  {
    condition: { isInfinite: true, isNecessity: true, isUnconscious: true },
    labelKey: 'fatalistGrandIdeas',
  },
  {
    condition: { isInfinite: true, isNecessity: true, isConscious: true },
    labelKey: 'knowsUselessness',
  },

  // Конечность + Возможность
  {
    condition: { isFinite: true, isPossibility: true, isUnconscious: true },
    labelKey: 'conformistPlaying',
  },
  {
    condition: { isFinite: true, isPossibility: true, isConscious: true },
    labelKey: 'seesExitsFears',
  },

  // Только бесконечность
  {
    condition: { isInfinite: true, isUnconscious: true },
    labelKey: 'lostInAbstractions',
  },
  {
    condition: { isInfinite: true, isConscious: true },
    labelKey: 'awaresDetachment',
  },

  // Только конечность
  {
    condition: { isFinite: true, isUnconscious: true },
    labelKey: 'dissolvedInWorld',
  },
  {
    condition: { isFinite: true, isConscious: true },
    labelKey: 'knowsLimitations',
  },

  // Только возможность
  {
    condition: { isPossibility: true, isUnconscious: true },
    labelKey: 'floatsInPossibilities',
  },
  {
    condition: { isPossibility: true, isConscious: true },
    labelKey: 'awaresChoiceParalysis',
  },

  // Только необходимость
  {
    condition: { isNecessity: true, isUnconscious: true },
    labelKey: 'acceptedFateUnthinking',
  },
  {
    condition: { isNecessity: true, isConscious: true },
    labelKey: 'consciousDeterminist',
  },

  // Осознанность
  {
    condition: { isConscious: true },
    labelKey: 'awaresOwnDespair',
  },
  {
    condition: { isUnconscious: true },
    labelKey: 'unawareOfIllness',
  },
  {
    condition: { isSemiconscious: true },
    labelKey: 'vagueAnxiety',
  },
];

const checkCondition = (vector: DespairVector, condition: LabelCondition): boolean => {
  const { finiteInfinite: fi, necessityPossibility: np, consciousness: c } = vector;

  const isInfinite = fi > 0.6;
  const isFinite = fi < 0.4;
  const isPossibility = np > 0.6;
  const isNecessity = np < 0.4;
  const isConscious = c > 0.6;
  const isUnconscious = c < 0.4;
  const isSemiconscious = c >= 0.4 && c <= 0.6;

  if (condition.isInfinite !== undefined && condition.isInfinite !== isInfinite) return false;
  if (condition.isFinite !== undefined && condition.isFinite !== isFinite) return false;
  if (condition.isPossibility !== undefined && condition.isPossibility !== isPossibility) return false;
  if (condition.isNecessity !== undefined && condition.isNecessity !== isNecessity) return false;
  if (condition.isConscious !== undefined && condition.isConscious !== isConscious) return false;
  if (condition.isUnconscious !== undefined && condition.isUnconscious !== isUnconscious) return false;
  if (condition.isSemiconscious !== undefined && condition.isSemiconscious !== isSemiconscious) return false;

  return true;
};

// Legacy function for backward compatibility (uses Russian)
export const generateLabel = (point: DespairPoint): string => {
  // Сначала пробуем найти совпадение в матрице
  for (const entry of LABEL_MATRIX) {
    if (checkCondition(point.vector, entry.condition)) {
      // Fallback to Russian for legacy usage
      const ruLabels: Record<string, string> = {
        dreamerUnknowing: 'Мечтатель, не знающий себя',
        reflectionDevours: 'Рефлексия пожирает действие',
        grandPlansInFog: 'Грандиозные планы в тумане',
        polishedPebble: 'Отшлифованная галька толпы',
        knowsCageAccepted: 'Знает клетку, принял её',
        vaguelyFeelsWalls: 'Смутно ощущает стены',
        fatalistGrandIdeas: 'Фаталист с грандиозными идеями',
        knowsUselessness: 'Знает бесполезность своих мечтаний',
        conformistPlaying: 'Конформист, играющий в варианты',
        seesExitsFears: 'Видит выходы, боится выйти',
        lostInAbstractions: 'Потерялся в абстракциях',
        awaresDetachment: 'Осознаёт свою оторванность',
        dissolvedInWorld: 'Растворился в мире',
        knowsLimitations: 'Знает свою ограниченность',
        floatsInPossibilities: 'Парит в возможностях',
        awaresChoiceParalysis: 'Осознаёт паралич выбора',
        acceptedFateUnthinking: 'Принял судьбу не думая',
        consciousDeterminist: 'Сознательный детерминист',
        awaresOwnDespair: 'Осознаёт своё отчаяние',
        unawareOfIllness: 'Не ведает своей болезни',
        vagueAnxiety: 'Смутная тревога',
      };
      return ruLabels[entry.labelKey] || entry.labelKey;
    }
  }

  // Если не нашли — генерируем на основе стадии
  const stageName = STAGE_NAMES[point.stage];
  if (point.stageSubtype && SUBTYPE_NAMES[point.stageSubtype]) {
    return `${stageName}: ${SUBTYPE_NAMES[point.stageSubtype]}`;
  }

  return `${stageName} стадия`;
};

// Localized version - accepts translations
export const generateLabelLocalized = (
  point: DespairPoint,
  t: TranslationStrings
): string => {
  // Сначала пробуем найти совпадение в матрице
  for (const entry of LABEL_MATRIX) {
    if (checkCondition(point.vector, entry.condition)) {
      return t.labels[entry.labelKey];
    }
  }

  // Если не нашли — генерируем на основе стадии
  const stageNames: Record<string, string> = {
    aesthetic: t.stages.aesthetic,
    ethical: t.stages.ethical,
    religious: t.stages.religious,
  };
  const stageName = stageNames[point.stage];

  const subtypeNames: Record<string, string> = {
    sensual: t.stageSubtypes.sensual,
    romantic: t.stageSubtypes.romantic,
    intellectual: t.stageSubtypes.intellectual,
    civic: t.stageSubtypes.civic,
    heroic: t.stageSubtypes.heroic,
    immanent: t.stageSubtypes.immanent,
    paradoxical: t.stageSubtypes.paradoxical,
  };

  if (point.stageSubtype && subtypeNames[point.stageSubtype]) {
    return `${stageName}: ${subtypeNames[point.stageSubtype]}`;
  }

  return `${stageName} ${t.labels.stageLabel}`;
};

// ===== ГЕНЕРАЦИЯ ОПИСАНИЙ =====

// Legacy version (Russian) for backward compatibility
export const generateProceduralDescription = (point: DespairPoint): string => {
  const parts: string[] = [];
  const { finiteInfinite: fi, necessityPossibility: np, consciousness: c } = point.vector;

  // Особый случай: религиозная стадия + высокая осознанность = точка спасения
  if (point.stage === 'religious' && c > 0.6) {
    parts.push('🕊️ ТОЧКА СПАСЕНИЯ');
    parts.push('Религиозная стадия с высокой осознанностью — это не отчаяние, а его преодоление. Здесь человек стоит перед Богом в полной прозрачности, без иллюзий и самообмана.');

    const stageDesc = STAGE_DESCRIPTIONS[point.stage];
    if (stageDesc) {
      if (point.stageSubtype && stageDesc.subtypes[point.stageSubtype]) {
        parts.push(stageDesc.subtypes[point.stageSubtype].full);
      } else {
        parts.push(stageDesc.base.full);
      }
    }

    return parts.join('\n\n');
  }

  // 1. Описание стадии
  const stageDesc = STAGE_DESCRIPTIONS[point.stage];
  if (stageDesc) {
    if (point.stageSubtype && stageDesc.subtypes[point.stageSubtype]) {
      parts.push(stageDesc.subtypes[point.stageSubtype].full);
    } else {
      parts.push(stageDesc.base.full);
    }
  }

  // 2. Описание осей (если в экстремуме)
  if (fi > 0.6 && point.axisSubtypes?.infinityType) {
    const desc = ZONE_DESCRIPTIONS.infinite[point.axisSubtypes.infinityType];
    if (desc) parts.push(desc.full);
  } else if (fi < 0.4 && point.axisSubtypes?.finitudeType) {
    const desc = ZONE_DESCRIPTIONS.finite[point.axisSubtypes.finitudeType];
    if (desc) parts.push(desc.full);
  }

  if (np > 0.6 && point.axisSubtypes?.possibilityType) {
    const desc = ZONE_DESCRIPTIONS.possibility[point.axisSubtypes.possibilityType];
    if (desc) parts.push(desc.full);
  } else if (np < 0.4 && point.axisSubtypes?.necessityType) {
    const desc = ZONE_DESCRIPTIONS.necessity[point.axisSubtypes.necessityType];
    if (desc) parts.push(desc.full);
  }

  // 3. Описание осознанности (с подтипами)
  if (c < 0.4) {
    // Неведение
    if (point.axisSubtypes?.unawarenessType) {
      const desc = ZONE_DESCRIPTIONS.unawareness[point.axisSubtypes.unawarenessType];
      if (desc) parts.push(desc.full);
    } else {
      parts.push(ZONE_DESCRIPTIONS.consciousness.unconscious.full);
    }
  } else if (c > 0.6) {
    // Осознанность
    if (point.axisSubtypes?.awarenessType) {
      const desc = ZONE_DESCRIPTIONS.awareness[point.axisSubtypes.awarenessType];
      if (desc) parts.push(desc.full);
    } else {
      parts.push(ZONE_DESCRIPTIONS.consciousness.conscious.full);
    }
  } else {
    parts.push(ZONE_DESCRIPTIONS.consciousness.semiconscious.full);
  }

  return parts.join('\n\n');
};

// Localized version - accepts translations
export const generateProceduralDescriptionLocalized = (
  point: DespairPoint,
  t: TranslationStrings,
  descriptions: TranslationDescriptions
): string => {
  const parts: string[] = [];
  const { finiteInfinite: fi, necessityPossibility: np, consciousness: c } = point.vector;

  // Особый случай: религиозная стадия + высокая осознанность = точка спасения
  if (point.stage === 'religious' && c > 0.6) {
    parts.push(`🕊️ ${t.salvationPoint.title.toUpperCase()}`);
    parts.push(t.salvationPoint.description);

    const stageDesc = descriptions.stages[point.stage];
    if (stageDesc) {
      if (point.stageSubtype) {
        const subtypeKey = point.stageSubtype as keyof typeof stageDesc.subtypes;
        const subtypeDesc = stageDesc.subtypes[subtypeKey] as { short: string; full: string } | undefined;
        if (subtypeDesc) {
          parts.push(subtypeDesc.full);
        }
      } else {
        parts.push(stageDesc.base.full);
      }
    }

    return parts.join('\n\n');
  }

  // 1. Описание стадии
  const stageDesc = descriptions.stages[point.stage];
  if (stageDesc) {
    if (point.stageSubtype) {
      const subtypeKey = point.stageSubtype as keyof typeof stageDesc.subtypes;
      const subtypeDesc = stageDesc.subtypes[subtypeKey] as { short: string; full: string } | undefined;
      if (subtypeDesc) {
        parts.push(subtypeDesc.full);
      } else {
        parts.push(stageDesc.base.full);
      }
    } else {
      parts.push(stageDesc.base.full);
    }
  }

  // 2. Описание осей (если в экстремуме)
  if (fi > 0.6 && point.axisSubtypes?.infinityType) {
    const desc = descriptions.infinite[point.axisSubtypes.infinityType];
    if (desc) parts.push(desc.full);
  } else if (fi < 0.4 && point.axisSubtypes?.finitudeType) {
    const desc = descriptions.finite[point.axisSubtypes.finitudeType];
    if (desc) parts.push(desc.full);
  }

  if (np > 0.6 && point.axisSubtypes?.possibilityType) {
    const desc = descriptions.possibility[point.axisSubtypes.possibilityType];
    if (desc) parts.push(desc.full);
  } else if (np < 0.4 && point.axisSubtypes?.necessityType) {
    const desc = descriptions.necessity[point.axisSubtypes.necessityType];
    if (desc) parts.push(desc.full);
  }

  // 3. Описание осознанности (с подтипами)
  if (c < 0.4) {
    // Неведение
    if (point.axisSubtypes?.unawarenessType) {
      const desc = descriptions.unawareness[point.axisSubtypes.unawarenessType];
      if (desc) parts.push(desc.full);
    } else {
      parts.push(descriptions.consciousness.unconscious.full);
    }
  } else if (c > 0.6) {
    // Осознанность
    if (point.axisSubtypes?.awarenessType) {
      const desc = descriptions.awareness[point.axisSubtypes.awarenessType];
      if (desc) parts.push(desc.full);
    } else {
      parts.push(descriptions.consciousness.conscious.full);
    }
  } else {
    parts.push(descriptions.consciousness.semiconscious.full);
  }

  return parts.join('\n\n');
};

// Алиас для обратной совместимости
export const generateDescription = generateProceduralDescription;

// ===== КООРДИНАТЫ В ТЕКСТ =====

export const vectorToText = (vector: DespairVector): string => {
  const { finiteInfinite: fi, necessityPossibility: np, consciousness: c } = vector;

  const fiText = fi < 0.4 ? 'конечное' : fi > 0.6 ? 'бесконечное' : 'баланс';
  const npText = np < 0.4 ? 'необходимость' : np > 0.6 ? 'возможность' : 'баланс';
  const cText = c < 0.4 ? 'неведение' : c > 0.6 ? 'осознанность' : 'полуосознанность';

  return `${fiText} / ${npText} / ${cText}`;
};

// ===== ПОЛУЧЕНИЕ ПОДТИПОВ ПО КООРДИНАТАМ =====

export const getSuggestedAxisSubtypes = (vector: DespairVector) => {
  const { finiteInfinite: fi, necessityPossibility: np, consciousness: c } = vector;

  return {
    showInfinity: fi > 0.6,
    showFinitude: fi < 0.4,
    showPossibility: np > 0.6,
    showNecessity: np < 0.4,
    showUnawareness: c < 0.4,
    showAwareness: c > 0.6,
  };
};
