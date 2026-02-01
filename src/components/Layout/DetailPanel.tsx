import { useCallback } from 'react';
import { useStore, useSelectedCharacter, useSelectedPoint } from '../../store/useStore';
import { useT } from '../../store/useLanguageStore';
import { PointEditor } from '../UI/PointEditor';
import { HistoryView } from '../UI/HistoryView';

export const DetailPanel: React.FC = () => {
  const t = useT();
  // Предотвращаем перехват событий Canvas/OrbitControls
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
  }, []);
  const selectedCharacter = useSelectedCharacter();
  const selectedPoint = useSelectedPoint();
  const editingPointId = useStore((state) => state.editingPointId);
  const openPointEditor = useStore((state) => state.openPointEditor);
  const closePointEditor = useStore((state) => state.closePointEditor);
  const isAddingPoint = useStore((state) => state.isAddingPoint);
  const setAddingPoint = useStore((state) => state.setAddingPoint);

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

  // Если редактируем точку
  if (editingPointId || isAddingPoint) {
    return (
      <div className="w-96 h-full bg-slate-900 border-l border-slate-700 flex flex-col relative z-10" onPointerDown={handlePointerDown}>
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {editingPointId ? t.points.editPoint : t.points.addPoint}
          </h2>
          <button
            onClick={() => {
              closePointEditor();
              setAddingPoint(false);
            }}
            className="p-1 hover:bg-slate-700 rounded"
          >
            <svg
              className="w-5 h-5 text-slate-400"
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
        <div className="flex-1 overflow-y-auto">
          <PointEditor
            characterId={selectedCharacter?.id || null}
            pointId={editingPointId}
            onClose={() => {
              closePointEditor();
              setAddingPoint(false);
            }}
          />
        </div>
      </div>
    );
  }

  // Если нет выбранного персонажа
  if (!selectedCharacter) {
    return (
      <div className="w-96 h-full bg-slate-900 border-l border-slate-700 flex items-center justify-center relative z-10" onPointerDown={handlePointerDown}>
        <div className="text-center text-slate-500 p-8">
          <svg
            className="w-16 h-16 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <p>{t.points.selectCharacterFirst}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 h-full bg-slate-900 border-l border-slate-700 flex flex-col relative z-10" onPointerDown={handlePointerDown}>
      {/* Заголовок персонажа */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: selectedCharacter.color }}
          />
          <h2 className="text-lg font-semibold text-white">
            {selectedCharacter.name}
          </h2>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          {selectedCharacter.points.length} {t.characters.points} ·{' '}
          {selectedCharacter.connections.length} {t.characters.connections}
        </p>
      </div>

      {/* Выбранная точка */}
      {selectedPoint && (
        <div className="p-4 border-b border-slate-700 bg-slate-800/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-300">
              {t.points.viewDetails}
            </h3>
            <button
              onClick={() => openPointEditor(selectedPoint.id)}
              className="text-xs text-violet-400 hover:text-violet-300"
            >
              {t.actions.edit}
            </button>
          </div>
          {selectedPoint.momentName && (
            <div className="text-xs text-slate-500 mb-1">
              {selectedPoint.momentName}
            </div>
          )}
          <div className="text-white font-medium mb-2">{selectedPoint.label}</div>
          <div className="text-xs text-slate-400 space-y-1">
            <div>
              {t.pointDetail.stage}: {stageNames[selectedPoint.stage]}
              {selectedPoint.stageSubtype &&
                ` (${subtypeNames[selectedPoint.stageSubtype]})`}
            </div>
            <div>{t.pointDetail.coordinates}: {Math.round(selectedPoint.vector.finiteInfinite * 100)}% / {Math.round(selectedPoint.vector.necessityPossibility * 100)}% / {Math.round(selectedPoint.vector.consciousness * 100)}%</div>
          </div>
        </div>
      )}

      {/* История */}
      <div className="flex-1 overflow-y-auto">
        <HistoryView character={selectedCharacter} />
      </div>

      {/* Кнопки действий */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        <button
          onClick={() => setAddingPoint(true)}
          className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {t.points.addPoint}
        </button>
        <div className="text-xs text-slate-500 text-center space-y-0.5">
          <p>{t.shortcuts.doubleClickForPath}</p>
          <p>{t.shortcuts.shiftClickToConnect}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;
