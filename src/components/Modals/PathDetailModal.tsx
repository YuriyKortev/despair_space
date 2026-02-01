import { useState } from 'react';
import { useStore, useSelectedCharacter } from '../../store/useStore';
import { useT, useDescriptions } from '../../store/useLanguageStore';
import { generateProceduralDescriptionLocalized } from '../../data/labels';
import { COLORS } from '../../utils/colorUtils';
import { findPathFromRoot, findConnection } from '../../utils/graphUtils';
import type { Character, DespairPoint } from '../../types';
import type { TranslationStrings, TranslationDescriptions } from '../../i18n/types';

/**
 * Generates localized LLM prompt with beat sheet synopsis and first-person phenomenology
 */
function generateLLMPromptLocalized(
  character: Character,
  path: DespairPoint[],
  t: TranslationStrings,
  descriptions: TranslationDescriptions
): string {
  const lines: string[] = [];

  const stageNamesMap: Record<string, string> = {
    aesthetic: t.stages.aesthetic,
    ethical: t.stages.ethical,
    religious: t.stages.religious,
  };

  const subtypeNamesMap: Record<string, string> = {
    sensual: t.stageSubtypes.sensual,
    romantic: t.stageSubtypes.romantic,
    intellectual: t.stageSubtypes.intellectual,
    civic: t.stageSubtypes.civic,
    heroic: t.stageSubtypes.heroic,
    immanent: t.stageSubtypes.immanent,
    paradoxical: t.stageSubtypes.paradoxical,
    imagination: t.axisSubtypes.imagination,
    cognition: t.axisSubtypes.cognition,
    feeling: t.axisSubtypes.feeling,
    will: t.axisSubtypes.will,
    conformist: t.axisSubtypes.conformist,
    prudent: t.axisSubtypes.prudent,
    combinatorial: t.axisSubtypes.combinatorial,
    paralyzed: t.axisSubtypes.paralyzed,
    fatalist: t.axisSubtypes.fatalist,
    determinist: t.axisSubtypes.determinist,
    naive: t.axisSubtypes.naive,
    busy: t.axisSubtypes.busy,
    denial: t.axisSubtypes.denial,
    suffering: t.axisSubtypes.suffering,
    defiant: t.axisSubtypes.defiant,
  };

  const transitionNamesMap: Record<string, string> = {
    evolution: t.transitionTypes.evolution,
    crisis: t.transitionTypes.crisis,
    branch: t.transitionTypes.branch,
  };

  // Header
  lines.push(`# ${t.appTitle}: Beat Sheet + First-Person Phenomenology`);
  lines.push(``);
  lines.push(`Generate a beat sheet synopsis of the character's trajectory and one detailed first-person experience of the central event.`);
  lines.push(``);

  // Character
  lines.push(`## Character: ${character.name}`);
  lines.push(``);

  // Core
  const hasCore = character.core.history.length > 0 || character.core.body || character.core.gift;
  if (hasCore) {
    lines.push(`### ${t.characterCore.history}`);
    if (character.core.history.length > 0) {
      lines.push(`- **${t.characterCore.history}:** ${character.core.history.join('; ')}`);
    }
    if (character.core.body) {
      lines.push(`- **${t.characterCore.body}:** ${character.core.body}`);
    }
    if (character.core.gift) {
      lines.push(`- **${t.characterCore.gift}:** ${character.core.gift}`);
    }
    lines.push(``);
  }

  // Kierkegaard context
  lines.push(`### Context: Kierkegaard's Model of Despair`);
  lines.push(``);
  lines.push(`The space of despair has three axes (values from 0% to 100%):`);
  lines.push(`- **${t.axes.finiteInfinite}:** ${t.axes.finite} — loss of self in the worldly. ${t.axes.infinite} — loss of world in self.`);
  lines.push(`- **${t.axes.necessityPossibility}:** ${t.axes.necessity} — determinism, fatalism. ${t.axes.possibility} — paralysis from excess options.`);
  lines.push(`- **${t.axes.unawareness} ↔ ${t.axes.awareness}:** ${t.axes.unawareness} — unaware of despair. ${t.axes.awareness} — acutely experiences their state.`);
  lines.push(``);
  lines.push(`Stages of existence:`);
  lines.push(`- **${t.stages.aesthetic}** — ${descriptions.stages.aesthetic.base.short}`);
  lines.push(`- **${t.stages.ethical}** — ${descriptions.stages.ethical.base.short}`);
  lines.push(`- **${t.stages.religious}** — ${descriptions.stages.religious.base.short}`);
  lines.push(``);

  // Trajectory
  lines.push(`## Character Trajectory (${path.length} ${t.characters.points})`);
  lines.push(``);

  path.forEach((point, index) => {
    const v = point.vector;
    const nextPoint = path[index + 1];
    const conn = nextPoint
      ? findConnection(character.connections, point.id, nextPoint.id)
      : undefined;

    lines.push(`### ${index + 1}. ${point.label}`);
    if (point.momentName) {
      lines.push(`**${t.points.momentName}:** ${point.momentName}`);
    }
    lines.push(``);

    // Position description
    lines.push(`**${t.pointDetail.coordinates}:**`);
    lines.push(`- ${t.axes.finiteInfinite}: ${Math.round(v.finiteInfinite * 100)}%`);
    lines.push(`- ${t.axes.necessityPossibility}: ${Math.round(v.necessityPossibility * 100)}%`);
    lines.push(`- ${t.axes.consciousness}: ${Math.round(v.consciousness * 100)}%`);

    // Stage with subtype
    const stageName = stageNamesMap[point.stage];
    const subtypeName = point.stageSubtype ? subtypeNamesMap[point.stageSubtype] : null;
    lines.push(`**${t.stages.title}:** ${stageName}${subtypeName ? ` (${subtypeName})` : ''}`);

    // Axis subtypes
    if (point.axisSubtypes) {
      const subtypes: string[] = [];
      if (point.axisSubtypes.infinityType) {
        subtypes.push(`${t.axes.infinite}: ${subtypeNamesMap[point.axisSubtypes.infinityType]}`);
      }
      if (point.axisSubtypes.finitudeType) {
        subtypes.push(`${t.axes.finite}: ${subtypeNamesMap[point.axisSubtypes.finitudeType]}`);
      }
      if (point.axisSubtypes.possibilityType) {
        subtypes.push(`${t.axes.possibility}: ${subtypeNamesMap[point.axisSubtypes.possibilityType]}`);
      }
      if (point.axisSubtypes.necessityType) {
        subtypes.push(`${t.axes.necessity}: ${subtypeNamesMap[point.axisSubtypes.necessityType]}`);
      }
      if (point.axisSubtypes.awarenessType) {
        subtypes.push(`${t.axes.awareness}: ${subtypeNamesMap[point.axisSubtypes.awarenessType]}`);
      }
      if (point.axisSubtypes.unawarenessType) {
        subtypes.push(`${t.axes.unawareness}: ${subtypeNamesMap[point.axisSubtypes.unawarenessType]}`);
      }
      if (subtypes.length > 0) {
        lines.push(`**State:** ${subtypes.join('; ')}`);
      }
    }

    if (point.description) {
      lines.push(`**Description:** ${point.description}`);
    }

    // Connection to next point
    if (conn) {
      lines.push(``);
      const transitionName = transitionNamesMap[conn.transitionType];
      if (conn.transitionType === 'crisis') {
        let crisisLine = `↓ **${transitionName}**`;
        if (conn.crisis?.trigger) {
          crisisLine += `: ${conn.crisis.trigger}`;
        }
        lines.push(crisisLine);
        if (conn.crisis?.alternatives && conn.crisis.alternatives.length > 0) {
          lines.push(`  _${t.connections.alternatives}: ${conn.crisis.alternatives.join(', ')}_`);
        }
      } else if (conn.transitionType === 'branch') {
        lines.push(`↓ **${transitionName}**`);
      } else {
        lines.push(`↓ **${transitionName}**`);
      }
    }

    lines.push(``);
  });

  // Instructions
  lines.push(`---`);
  lines.push(`## What to generate:`);
  lines.push(``);
  lines.push(`### 1. Beat Sheet Synopsis`);
  lines.push(`Structured description of the key beats of the trajectory: setup, rising action, climax, resolution. Base it on the character's position in the despair space and transitions between states.`);
  lines.push(``);
  lines.push(`### 2. First-Person Phenomenology`);
  lines.push(`One detailed experience of the central event from the first person. This should be an inner monologue: what the character feels, how they perceive the world, what bodily sensations they experience. Convey their unique way of being in the world, based on their position on the despair axes.`);

  return lines.join('\n');
}

export const PathDetailModal: React.FC = () => {
  const t = useT();
  const descriptions = useDescriptions();
  const closePathDetail = useStore((state) => state.closePathDetail);
  const pathDetailPointId = useStore((state) => state.pathDetailPointId);
  const openConnectionEditor = useStore((state) => state.openConnectionEditor);
  const character = useSelectedCharacter();
  const [copied, setCopied] = useState(false);

  const stageNames = {
    aesthetic: t.stages.aesthetic,
    ethical: t.stages.ethical,
    religious: t.stages.religious,
  };

  const subtypeNames: Record<string, string> = {
    sensual: t.stageSubtypes.sensual,
    romantic: t.stageSubtypes.romantic,
    intellectual: t.stageSubtypes.intellectual,
    civic: t.stageSubtypes.civic,
    heroic: t.stageSubtypes.heroic,
    immanent: t.stageSubtypes.immanent,
    paradoxical: t.stageSubtypes.paradoxical,
  };

  const transitionNames = {
    evolution: t.transitionTypes.evolution,
    crisis: t.transitionTypes.crisis,
    branch: t.transitionTypes.branch,
  };

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
                {t.pathDetail.title}
              </h2>
              <div className="text-sm text-slate-400 mt-1">
                {character.name} · {path.length} {t.characters.points}
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
                          {stageNames[point.stage]}
                          {point.stageSubtype && (
                            <span className="text-slate-500">
                              {' · '}{subtypeNames[point.stageSubtype]}
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
                        {t.pathDetail.authorDescription}
                      </div>
                      <div className="text-sm text-slate-300 whitespace-pre-wrap bg-slate-700/50 p-2 rounded border-l-2 border-violet-500">
                        {point.description}
                      </div>
                    </div>
                  )}

                  {/* Процедурное описание */}
                  <div>
                    <div className="text-xs font-medium text-slate-500 mb-1">
                      {t.pathDetail.stateAnalysis}
                    </div>
                    <div className="text-sm text-slate-400 whitespace-pre-wrap">
                      {generateProceduralDescriptionLocalized(point, t, descriptions)}
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
                      title={t.connections.editConnection}
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
                      {transitionNames[connection.transitionType]}
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
              const prompt = generateLLMPromptLocalized(character, path, t, descriptions);
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
                {t.characters.promptCopied}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                {t.characters.copyPrompt}
              </>
            )}
          </button>
          <button
            onClick={closePathDetail}
            className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            {t.actions.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathDetailModal;
