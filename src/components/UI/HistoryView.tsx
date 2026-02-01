import type { Character } from '../../types';
import { useStore } from '../../store/useStore';
import { useT } from '../../store/useLanguageStore';
import { buildHistoryTree, copyHistoryToPoint, flattenTreeWithDepth } from '../../utils/graphUtils';
import { COLORS } from '../../utils/colorUtils';

interface HistoryViewProps {
  character: Character;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ character }) => {
  const t = useT();
  const selectPoint = useStore((state) => state.selectPoint);
  const openPointEditor = useStore((state) => state.openPointEditor);
  const openPathDetail = useStore((state) => state.openPathDetail);
  const selectedPointId = useStore((state) => state.selectedPointId);

  const stageNames = {
    aesthetic: t.stages.aesthetic,
    ethical: t.stages.ethical,
    religious: t.stages.religious,
  };

  const transitionNames = {
    evolution: t.transitionTypes.evolution,
    crisis: t.transitionTypes.crisis,
    branch: t.transitionTypes.branch,
  };

  const tree = buildHistoryTree(
    character.points,
    character.connections,
    character.rootPointId
  );

  const flatList = flattenTreeWithDepth(tree);

  const handleCopy = async (pointId: string) => {
    const text = copyHistoryToPoint(character, pointId);
    if (text) {
      await navigator.clipboard.writeText(text);
      // Можно добавить тост-уведомление
    }
  };

  if (character.points.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500">
        <svg
          className="w-12 h-12 mx-auto mb-3 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <p className="text-sm">{t.characters.noCharacters}</p>
        <p className="text-xs mt-1">{t.points.addPoint}</p>
      </div>
    );
  }

  // Ядро персонажа
  const CoreSection = () => (
    <div className="p-3 bg-slate-800/50 rounded-lg mb-4">
      <h4 className="text-xs font-medium text-slate-400 mb-2">{t.characterCore.history}</h4>
      {character.core.history.length > 0 && (
        <ul className="text-sm text-slate-300 space-y-1 mb-2">
          {character.core.history.map((h, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-slate-500">•</span>
              {h}
            </li>
          ))}
        </ul>
      )}
      {character.core.body && (
        <div className="text-xs text-slate-400">
          <span className="text-slate-500">{t.characterCore.body}:</span> {character.core.body}
        </div>
      )}
      {character.core.gift && (
        <div className="text-xs text-slate-400">
          <span className="text-slate-500">{t.characterCore.gift}:</span> {character.core.gift}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4">
      <h3 className="text-sm font-medium text-slate-300 mb-3">{t.characterCore.history}</h3>

      {(character.core.history.length > 0 ||
        character.core.body ||
        character.core.gift) && <CoreSection />}

      {/* Траектория */}
      <div className="space-y-1">
        {flatList.map(({ point, depth, connection }) => {
          const isSelected = selectedPointId === point.id;
          const stageColor = COLORS.stages[point.stage];

          return (
            <div key={point.id}>
              {/* Индикатор связи */}
              {connection && (
                <div
                  className="ml-3 flex items-center gap-2 py-1"
                  style={{ paddingLeft: `${depth * 12}px` }}
                >
                  <div
                    className="w-4 h-0.5"
                    style={{ backgroundColor: COLORS.connections[connection.transitionType] }}
                  />
                  <span
                    className="text-[10px]"
                    style={{ color: COLORS.connections[connection.transitionType] }}
                  >
                    {transitionNames[connection.transitionType]}
                  </span>
                  {connection.crisis?.trigger && (
                    <span className="text-[10px] text-slate-500">
                      — {connection.crisis.trigger}
                    </span>
                  )}
                </div>
              )}

              {/* Карточка точки */}
              <div
                onClick={() => selectPoint(point.id)}
                onDoubleClick={() => openPathDetail(point.id)}
                className={`
                  p-2 rounded-lg cursor-pointer transition-all group border
                  ${isSelected ? 'bg-slate-700' : 'bg-slate-800/50 hover:bg-slate-800 border-transparent'}
                `}
                style={{
                  marginLeft: `${depth * 12}px`,
                  borderColor: isSelected ? stageColor : 'transparent',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {point.momentName && (
                      <div className="text-[10px] text-slate-500 mb-0.5">
                        {point.momentName}
                      </div>
                    )}
                    <div className="text-sm text-white truncate">{point.label}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: stageColor }}
                      />
                      <span className="text-[10px] text-slate-400">
                        {stageNames[point.stage]}
                      </span>
                    </div>
                  </div>

                  {/* Кнопки действий */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(point.id);
                      }}
                      className="p-1 hover:bg-slate-600 rounded"
                      title={t.characters.copyPrompt}
                    >
                      <svg
                        className="w-3.5 h-3.5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openPointEditor(point.id);
                      }}
                      className="p-1 hover:bg-slate-600 rounded"
                      title={t.actions.edit}
                    >
                      <svg
                        className="w-3.5 h-3.5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryView;
