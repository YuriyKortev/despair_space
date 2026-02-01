import { useState } from 'react';
import { useStore, useSelectedCharacter } from '../../store/useStore';
import { STAGE_NAMES, SUBTYPE_NAMES, TRANSITION_NAMES } from '../../data/descriptions';
import { generateProceduralDescription } from '../../data/labels';
import { COLORS } from '../../utils/colorUtils';
import { findPathFromRoot, findConnection } from '../../utils/graphUtils';
import type { Character, DespairPoint } from '../../types';

/**
 * Описывает позицию на оси словами
 */
function describeAxisPosition(value: number, lowLabel: string, highLabel: string): string {
  if (value < 0.2) return `глубоко в ${lowLabel}`;
  if (value < 0.4) return `склоняется к ${lowLabel}`;
  if (value < 0.6) return `между ${lowLabel} и ${highLabel}`;
  if (value < 0.8) return `склоняется к ${highLabel}`;
  return `глубоко в ${highLabel}`;
}

/**
 * Генерирует промпт для LLM с beat sheet синопсисом и феноменологией от лица персонажа
 */
function generateLLMPrompt(character: Character, path: DespairPoint[]): string {
  const lines: string[] = [];

  // Заголовок
  lines.push(`# Задание: Beat Sheet синопсис + Феноменология от лица персонажа`);
  lines.push(``);
  lines.push(`Сгенерируй beat sheet синопсис траектории персонажа и одно развёрнутое переживание центрального события от первого лица ("Феноменология от лица персонажа").`);
  lines.push(``);

  // Персонаж
  lines.push(`## Персонаж: ${character.name}`);
  lines.push(``);

  // Core — только если есть данные
  const hasCore = character.core.history.length > 0 || character.core.body || character.core.gift;
  if (hasCore) {
    lines.push(`### Ядро персонажа`);
    if (character.core.history.length > 0) {
      lines.push(`- **Ключевые события прошлого:** ${character.core.history.join('; ')}`);
    }
    if (character.core.body) {
      lines.push(`- **Физическое описание:** ${character.core.body}`);
    }
    if (character.core.gift) {
      lines.push(`- **Талант/способность:** ${character.core.gift}`);
    }
    lines.push(``);
  }

  // Контекст модели Кьеркегора
  lines.push(`### Контекст: Модель отчаяния Сёрена Кьеркегора`);
  lines.push(``);
  lines.push(`Пространство отчаяния имеет три оси (значения от 0% до 100%):`);
  lines.push(`- **Конечное ↔ Бесконечное:** Конечное — потеря себя в мирском, приспособленчество. Бесконечное — потеря мира в себе, уход в фантазии и абстракции.`);
  lines.push(`- **Необходимость ↔ Возможность:** Необходимость — детерминизм, фатализм. Возможность — паралич от избытка вариантов.`);
  lines.push(`- **Неведение ↔ Осознанность:** Неведение — не знает о своём отчаянии. Осознанность — остро переживает своё состояние.`);
  lines.push(``);
  lines.push(`Стадии существования:`);
  lines.push(`- **Эстетическая** — жизнь моментом, погоня за впечатлениями, избегание выбора`);
  lines.push(`- **Этическая** — жизнь долгом, принятие ответственности, постоянство`);
  lines.push(`- **Религиозная** — жизнь перед Богом, прыжок веры через абсурд`);
  lines.push(``);

  // Траектория
  lines.push(`## Траектория персонажа (${path.length} ${path.length === 1 ? 'состояние' : path.length < 5 ? 'состояния' : 'состояний'})`);
  lines.push(``);

  path.forEach((point, index) => {
    const v = point.vector;
    const nextPoint = path[index + 1];
    const conn = nextPoint
      ? findConnection(character.connections, point.id, nextPoint.id)
      : undefined;

    lines.push(`### ${index + 1}. ${point.label}`);
    if (point.momentName) {
      lines.push(`**Момент в сюжете:** ${point.momentName}`);
    }
    lines.push(``);

    // Человеческое описание позиции в пространстве
    lines.push(`**Положение в пространстве отчаяния:**`);
    lines.push(`- ${describeAxisPosition(v.finiteInfinite, 'Конечном', 'Бесконечном')} (${Math.round(v.finiteInfinite * 100)}%)`);
    lines.push(`- ${describeAxisPosition(v.necessityPossibility, 'Необходимости', 'Возможности')} (${Math.round(v.necessityPossibility * 100)}%)`);
    lines.push(`- ${describeAxisPosition(v.consciousness, 'Неведении', 'Осознанности')} (${Math.round(v.consciousness * 100)}%)`);

    // Стадия с подтипом
    const stageName = STAGE_NAMES[point.stage];
    const subtypeName = point.stageSubtype ? SUBTYPE_NAMES[point.stageSubtype] : null;
    lines.push(`**Стадия существования:** ${stageName}${subtypeName ? ` (${subtypeName})` : ''}`);

    // Подтипы осей если заданы — с человеческими названиями
    if (point.axisSubtypes) {
      const subtypes: string[] = [];
      if (point.axisSubtypes.infinityType) {
        subtypes.push(`Бесконечное: ${SUBTYPE_NAMES[point.axisSubtypes.infinityType]}`);
      }
      if (point.axisSubtypes.finitudeType) {
        subtypes.push(`Конечное: ${SUBTYPE_NAMES[point.axisSubtypes.finitudeType]}`);
      }
      if (point.axisSubtypes.possibilityType) {
        subtypes.push(`Возможность: ${SUBTYPE_NAMES[point.axisSubtypes.possibilityType]}`);
      }
      if (point.axisSubtypes.necessityType) {
        subtypes.push(`Необходимость: ${SUBTYPE_NAMES[point.axisSubtypes.necessityType]}`);
      }
      if (point.axisSubtypes.awarenessType) {
        subtypes.push(`Осознанность: ${SUBTYPE_NAMES[point.axisSubtypes.awarenessType]}`);
      }
      if (point.axisSubtypes.unawarenessType) {
        subtypes.push(`Неведение: ${SUBTYPE_NAMES[point.axisSubtypes.unawarenessType]}`);
      }
      if (subtypes.length > 0) {
        lines.push(`**Характер состояния:** ${subtypes.join('; ')}`);
      }
    }

    if (point.description) {
      lines.push(`**Авторское описание:** ${point.description}`);
    }

    // Связь к следующей точке
    if (conn) {
      lines.push(``);
      const transitionName = TRANSITION_NAMES[conn.transitionType];
      if (conn.transitionType === 'crisis') {
        let crisisLine = `↓ **${transitionName}**`;
        if (conn.crisis?.trigger) {
          crisisLine += `: ${conn.crisis.trigger}`;
        }
        lines.push(crisisLine);
        if (conn.crisis?.alternatives && conn.crisis.alternatives.length > 0) {
          lines.push(`  _Альтернативные пути: ${conn.crisis.alternatives.join(', ')}_`);
        }
      } else if (conn.transitionType === 'branch') {
        lines.push(`↓ **${transitionName}** (альтернативное развитие)`);
      } else {
        lines.push(`↓ **${transitionName}** (постепенное изменение)`);
      }
    }

    lines.push(``);
  });

  // Инструкция
  lines.push(`---`);
  lines.push(`## Что нужно сгенерировать:`);
  lines.push(``);
  lines.push(`### 1. Beat Sheet синопсис`);
  lines.push(`Структурированное описание ключевых битов траектории: завязка, нарастание, кульминация, развязка. Опирайся на положение персонажа в пространстве отчаяния и переходы между состояниями.`);
  lines.push(``);
  lines.push(`### 2. Феноменология от лица персонажа`);
  lines.push(`Одно развёрнутое переживание центрального события от первого лица. Это должен быть внутренний монолог: что персонаж чувствует, как воспринимает мир, какие телесные ощущения испытывает. Передай его уникальный способ быть в мире, исходя из его положения на осях отчаяния.`);

  return lines.join('\n');
}

export const PathDetailModal: React.FC = () => {
  const closePathDetail = useStore((state) => state.closePathDetail);
  const pathDetailPointId = useStore((state) => state.pathDetailPointId);
  const openConnectionEditor = useStore((state) => state.openConnectionEditor);
  const character = useSelectedCharacter();
  const [copied, setCopied] = useState(false);

  if (!character || !pathDetailPointId) return null;

  const path = findPathFromRoot(
    character.points,
    character.connections,
    character.rootPointId,
    pathDetailPointId
  );

  if (path.length === 0) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={closePathDetail}
    >
      <div
        className="bg-slate-900 rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Путь к точке
              </h2>
              <div className="text-sm text-slate-400 mt-1">
                {character.name} · {path.length} {path.length === 1 ? 'точка' : path.length < 5 ? 'точки' : 'точек'}
              </div>
            </div>
            <button
              onClick={closePathDetail}
              className="p-1 hover:bg-slate-700 rounded"
            >
              <svg
                className="w-6 h-6 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Контент - список точек */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {path.map((point, index) => {
            const stageColor = COLORS.stages[point.stage];
            const nextPoint = path[index + 1];
            const connection = nextPoint
              ? findConnection(character.connections, point.id, nextPoint.id)
              : undefined;

            return (
              <div key={point.id}>
                {/* Точка */}
                <div
                  className="bg-slate-800 rounded-lg p-4"
                  style={{ borderLeftColor: stageColor, borderLeftWidth: '4px' }}
                >
                  {/* Заголовок точки */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                          {index + 1}
                        </span>
                        {point.momentName && (
                          <span className="text-sm text-slate-400">
                            {point.momentName}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-white">
                        {point.label}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: stageColor }}
                        />
                        <span className="text-sm text-slate-400">
                          {STAGE_NAMES[point.stage]}
                          {point.stageSubtype && (
                            <span className="text-slate-500">
                              {' · '}{SUBTYPE_NAMES[point.stageSubtype]}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      [{Math.round(point.vector.finiteInfinite * 100)}%,{' '}
                      {Math.round(point.vector.necessityPossibility * 100)}%,{' '}
                      {Math.round(point.vector.consciousness * 100)}%]
                    </div>
                  </div>

                  {/* Пользовательское описание */}
                  {point.description && (
                    <div className="mb-3">
                      <div className="text-xs font-medium text-violet-400 mb-1">
                        Описание автора
                      </div>
                      <div className="text-sm text-slate-300 whitespace-pre-wrap bg-slate-700/50 p-2 rounded border-l-2 border-violet-500">
                        {point.description}
                      </div>
                    </div>
                  )}

                  {/* Процедурное описание */}
                  <div>
                    <div className="text-xs font-medium text-slate-500 mb-1">
                      Анализ состояния
                    </div>
                    <div className="text-sm text-slate-400 whitespace-pre-wrap">
                      {generateProceduralDescription(point)}
                    </div>
                  </div>
                </div>

                {/* Связь к следующей точке */}
                {connection && (
                  <div className="flex items-center gap-2 py-2 px-4">
                    <div className="flex-1 h-px bg-slate-700" />
                    <button
                      type="button"
                      onClick={() => openConnectionEditor(connection.id)}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor:
                          connection.transitionType === 'crisis'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : connection.transitionType === 'branch'
                            ? 'rgba(251, 146, 60, 0.2)'
                            : 'rgba(100, 116, 139, 0.2)',
                        color:
                          connection.transitionType === 'crisis'
                            ? '#ef4444'
                            : connection.transitionType === 'branch'
                            ? '#fb923c'
                            : '#94a3b8',
                      }}
                      title="Редактировать связь"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                      {TRANSITION_NAMES[connection.transitionType]}
                      {connection.crisis?.trigger && (
                        <span className="text-slate-500 ml-1">
                          — {connection.crisis.trigger}
                        </span>
                      )}
                      <svg
                        className="w-3 h-3 ml-1 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <div className="flex-1 h-px bg-slate-700" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Футер */}
        <div className="p-4 border-t border-slate-700 flex gap-3">
          <button
            onClick={() => {
              const prompt = generateLLMPrompt(character, path);
              navigator.clipboard.writeText(prompt).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              });
            }}
            className="flex-1 py-2 px-4 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Скопировано
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Копировать промпт
              </>
            )}
          </button>
          <button
            onClick={closePathDetail}
            className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathDetailModal;
