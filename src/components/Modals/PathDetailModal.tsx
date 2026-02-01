import { useState } from 'react';
import { useStore, useSelectedCharacter } from '../../store/useStore';
import { STAGE_NAMES, SUBTYPE_NAMES, TRANSITION_NAMES } from '../../data/descriptions';
import { generateProceduralDescription } from '../../data/labels';
import { COLORS } from '../../utils/colorUtils';
import { findPathFromRoot, findConnection } from '../../utils/graphUtils';
import type { Character, DespairPoint } from '../../types';

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
      lines.push(`- **История:** ${character.core.history.join('; ')}`);
    }
    if (character.core.body) {
      lines.push(`- **Тело:** ${character.core.body}`);
    }
    if (character.core.gift) {
      lines.push(`- **Дар:** ${character.core.gift}`);
    }
    lines.push(``);
  }

  // Контекст осей
  lines.push(`### Оси пространства отчаяния (значения 0.0–1.0)`);
  lines.push(`- **finiteInfinite:** 0 = Конечное (потеря себя в мире), 1 = Бесконечное (потеря мира в себе)`);
  lines.push(`- **necessityPossibility:** 0 = Необходимость (детерминизм), 1 = Возможность (паралич выбора)`);
  lines.push(`- **consciousness:** 0 = Неведение, 1 = Полная осознанность`);
  lines.push(``);

  // Подтипы осей
  lines.push(`### Подтипы осей`);
  lines.push(`**Бесконечное (>0.6):** imagination, cognition, feeling, will`);
  lines.push(`**Конечное (<0.4):** conformist, prudent`);
  lines.push(`**Возможность (>0.6):** combinatorial, paralyzed`);
  lines.push(`**Необходимость (<0.4):** fatalist, determinist`);
  lines.push(`**Осознанность (>0.6):** suffering, defiant`);
  lines.push(`**Неведение (<0.4):** naive, busy, denial`);
  lines.push(``);

  // Стадии
  lines.push(`### Стадии существования`);
  lines.push(`- **aesthetic:** Эстетическая (sensual, romantic, intellectual)`);
  lines.push(`- **ethical:** Этическая (civic, heroic)`);
  lines.push(`- **religious:** Религиозная (immanent, paradoxical)`);
  lines.push(``);

  // Траектория
  lines.push(`## Траектория (${path.length} точек)`);
  lines.push(``);

  path.forEach((point, index) => {
    const v = point.vector;
    const nextPoint = path[index + 1];
    const conn = nextPoint
      ? findConnection(character.connections, point.id, nextPoint.id)
      : undefined;

    lines.push(`### ${index + 1}. ${point.label}`);
    if (point.momentName) {
      lines.push(`**Момент:** ${point.momentName}`);
    }
    lines.push(`**Вектор:** [${v.finiteInfinite.toFixed(2)}, ${v.necessityPossibility.toFixed(2)}, ${v.consciousness.toFixed(2)}]`);
    lines.push(`**Стадия:** ${point.stage}${point.stageSubtype ? ` (${point.stageSubtype})` : ''}`);

    // Подтипы осей если заданы
    if (point.axisSubtypes) {
      const subtypes: string[] = [];
      if (point.axisSubtypes.infinityType) subtypes.push(`infinity:${point.axisSubtypes.infinityType}`);
      if (point.axisSubtypes.finitudeType) subtypes.push(`finitude:${point.axisSubtypes.finitudeType}`);
      if (point.axisSubtypes.possibilityType) subtypes.push(`possibility:${point.axisSubtypes.possibilityType}`);
      if (point.axisSubtypes.necessityType) subtypes.push(`necessity:${point.axisSubtypes.necessityType}`);
      if (point.axisSubtypes.awarenessType) subtypes.push(`awareness:${point.axisSubtypes.awarenessType}`);
      if (point.axisSubtypes.unawarenessType) subtypes.push(`unawareness:${point.axisSubtypes.unawarenessType}`);
      if (subtypes.length > 0) {
        lines.push(`**Подтипы осей:** ${subtypes.join(', ')}`);
      }
    }

    if (point.description) {
      lines.push(`**Описание:** ${point.description}`);
    }

    // Связь к следующей точке
    if (conn) {
      let transitionLine = `→ **Переход:** ${conn.transitionType}`;
      if (conn.crisis?.trigger) {
        transitionLine += ` — триггер: "${conn.crisis.trigger}"`;
      }
      if (conn.crisis?.alternatives && conn.crisis.alternatives.length > 0) {
        transitionLine += ` (альтернативы: ${conn.crisis.alternatives.join(', ')})`;
      }
      lines.push(transitionLine);
    }

    lines.push(``);
  });

  // Инструкция
  lines.push(`---`);
  lines.push(`## Что нужно сгенерировать:`);
  lines.push(`1. **Beat Sheet синопсис** — структурированное описание ключевых битов траектории`);
  lines.push(`2. **Феноменология от лица персонажа** — одно развёрнутое переживание центрального события от первого лица (внутренний монолог, ощущения, восприятие)`);

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
