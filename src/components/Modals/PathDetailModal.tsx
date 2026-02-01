import { useStore, useSelectedCharacter } from '../../store/useStore';
import { STAGE_NAMES, SUBTYPE_NAMES, TRANSITION_NAMES } from '../../data/descriptions';
import { generateProceduralDescription } from '../../data/labels';
import { COLORS } from '../../utils/colorUtils';
import { findPathFromRoot, findConnection } from '../../utils/graphUtils';

export const PathDetailModal: React.FC = () => {
  const closePathDetail = useStore((state) => state.closePathDetail);
  const pathDetailPointId = useStore((state) => state.pathDetailPointId);
  const character = useSelectedCharacter();

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
                    <div
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded"
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
                    </div>
                    <div className="flex-1 h-px bg-slate-700" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Футер */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={closePathDetail}
            className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathDetailModal;
