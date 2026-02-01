import type { DespairPoint, DespairVector } from '../types';
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
  label: string;
}

const LABEL_MATRIX: LabelEntry[] = [
  // Бесконечность + Возможность
  {
    condition: { isInfinite: true, isPossibility: true, isUnconscious: true },
    label: 'Мечтатель, не знающий себя',
  },
  {
    condition: { isInfinite: true, isPossibility: true, isConscious: true },
    label: 'Рефлексия пожирает действие',
  },
  {
    condition: { isInfinite: true, isPossibility: true, isSemiconscious: true },
    label: 'Грандиозные планы в тумане',
  },

  // Конечность + Необходимость
  {
    condition: { isFinite: true, isNecessity: true, isUnconscious: true },
    label: 'Отшлифованная галька толпы',
  },
  {
    condition: { isFinite: true, isNecessity: true, isConscious: true },
    label: 'Знает клетку, принял её',
  },
  {
    condition: { isFinite: true, isNecessity: true, isSemiconscious: true },
    label: 'Смутно ощущает стены',
  },

  // Бесконечность + Необходимость
  {
    condition: { isInfinite: true, isNecessity: true, isUnconscious: true },
    label: 'Фаталист с грандиозными идеями',
  },
  {
    condition: { isInfinite: true, isNecessity: true, isConscious: true },
    label: 'Знает бесполезность своих мечтаний',
  },

  // Конечность + Возможность
  {
    condition: { isFinite: true, isPossibility: true, isUnconscious: true },
    label: 'Конформист, играющий в варианты',
  },
  {
    condition: { isFinite: true, isPossibility: true, isConscious: true },
    label: 'Видит выходы, боится выйти',
  },

  // Только бесконечность
  {
    condition: { isInfinite: true, isUnconscious: true },
    label: 'Потерялся в абстракциях',
  },
  {
    condition: { isInfinite: true, isConscious: true },
    label: 'Осознаёт свою оторванность',
  },

  // Только конечность
  {
    condition: { isFinite: true, isUnconscious: true },
    label: 'Растворился в мире',
  },
  {
    condition: { isFinite: true, isConscious: true },
    label: 'Знает свою ограниченность',
  },

  // Только возможность
  {
    condition: { isPossibility: true, isUnconscious: true },
    label: 'Парит в возможностях',
  },
  {
    condition: { isPossibility: true, isConscious: true },
    label: 'Осознаёт паралич выбора',
  },

  // Только необходимость
  {
    condition: { isNecessity: true, isUnconscious: true },
    label: 'Принял судьбу не думая',
  },
  {
    condition: { isNecessity: true, isConscious: true },
    label: 'Сознательный детерминист',
  },

  // Осознанность
  {
    condition: { isConscious: true },
    label: 'Осознаёт своё отчаяние',
  },
  {
    condition: { isUnconscious: true },
    label: 'Не ведает своей болезни',
  },
  {
    condition: { isSemiconscious: true },
    label: 'Смутная тревога',
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

export const generateLabel = (point: DespairPoint): string => {
  // Сначала пробуем найти совпадение в матрице
  for (const entry of LABEL_MATRIX) {
    if (checkCondition(point.vector, entry.condition)) {
      return entry.label;
    }
  }

  // Если не нашли — генерируем на основе стадии
  const stageName = STAGE_NAMES[point.stage];
  if (point.stageSubtype && SUBTYPE_NAMES[point.stageSubtype]) {
    return `${stageName}: ${SUBTYPE_NAMES[point.stageSubtype]}`;
  }

  return `${stageName} стадия`;
};

// ===== ГЕНЕРАЦИЯ ОПИСАНИЙ =====

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
