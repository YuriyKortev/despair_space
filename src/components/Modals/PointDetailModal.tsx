import { useStore, useSelectedCharacter, useSelectedPoint } from '../../store/useStore';
import { useT, useDescriptions } from '../../store/useLanguageStore';
import { generateProceduralDescriptionLocalized } from '../../data/labels';
import { COLORS } from '../../utils/colorUtils';
import { copyHistoryToPoint } from '../../utils/graphUtils';

export const PointDetailModal: React.FC = () => {
  const t = useT();
  const descriptions = useDescriptions();
  const closePointDetail = useStore((state) => state.closePointDetail);
  const openPointEditor = useStore((state) => state.openPointEditor);
  const character = useSelectedCharacter();
  const point = useSelectedPoint();

  if (!point || !character) return null;

  const stageColor = COLORS.stages[point.stage];

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

  const handleCopy = async () => {
    const text = copyHistoryToPoint(character, point.id);
    if (text) {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={closePointDetail}
    >
      <div
        className="bg-slate-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div
          className="p-4 border-b border-slate-700"
          style={{ borderLeftColor: stageColor, borderLeftWidth: '4px' }}
        >
          <div className="flex items-start justify-between">
            <div>
              {point.momentName && (
                <div className="text-sm text-slate-400 mb-1">{point.momentName}</div>
              )}
              <h2 className="text-xl font-semibold text-white">{point.label}</h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stageColor }}
                  />
                  <span className="text-sm text-slate-300">
                    {stageNames[point.stage]}
                    {point.stageSubtype && (
                      <span className="text-slate-500">
                        {' '}
                        · {subtypeNames[point.stageSubtype]}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={closePointDetail}
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

        {/* Контент */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Координаты */}
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2">
              {t.pointDetail.coordinates}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-800 rounded-lg">
                <div
                  className="text-xs font-medium mb-1"
                  style={{ color: COLORS.axes.finiteInfinite }}
                >
                  {t.axes.finiteInfinite}
                </div>
                <div className="text-lg font-semibold text-white">
                  {Math.round(point.vector.finiteInfinite * 100)}%
                </div>
                <div className="text-xs text-slate-500">
                  {point.vector.finiteInfinite < 0.4
                    ? t.axes.finite
                    : point.vector.finiteInfinite > 0.6
                    ? t.axes.infinite
                    : t.axes.balance}
                </div>
              </div>
              <div className="p-3 bg-slate-800 rounded-lg">
                <div
                  className="text-xs font-medium mb-1"
                  style={{ color: COLORS.axes.necessityPossibility }}
                >
                  {t.axes.necessityPossibility}
                </div>
                <div className="text-lg font-semibold text-white">
                  {Math.round(point.vector.necessityPossibility * 100)}%
                </div>
                <div className="text-xs text-slate-500">
                  {point.vector.necessityPossibility < 0.4
                    ? t.axes.necessity
                    : point.vector.necessityPossibility > 0.6
                    ? t.axes.possibility
                    : t.axes.balance}
                </div>
              </div>
              <div className="p-3 bg-slate-800 rounded-lg">
                <div
                  className="text-xs font-medium mb-1"
                  style={{ color: COLORS.axes.consciousness }}
                >
                  {t.axes.consciousness}
                </div>
                <div className="text-lg font-semibold text-white">
                  {Math.round(point.vector.consciousness * 100)}%
                </div>
                <div className="text-xs text-slate-500">
                  {point.vector.consciousness < 0.4
                    ? t.axes.unawareness
                    : point.vector.consciousness > 0.6
                    ? t.axes.awareness
                    : t.axes.semiconscious}
                </div>
              </div>
            </div>
          </div>

          {/* Пользовательское описание */}
          {point.description && (
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">
                {t.pathDetail.authorDescription}
              </h3>
              <div className="text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-800/50 p-3 rounded-lg border-l-2 border-violet-500">
                {point.description}
              </div>
            </div>
          )}

          {/* Процедурное описание */}
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2">
              {t.pointDetail.stage}
            </h3>
            <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
              {generateProceduralDescriptionLocalized(point, t, descriptions)}
            </div>
          </div>
        </div>

        {/* Футер */}
        <div className="p-4 border-t border-slate-700 flex justify-between">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
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
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            {t.characters.copyPrompt}
          </button>
          <button
            onClick={() => {
              closePointDetail();
              openPointEditor(point.id);
            }}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
          >
            {t.actions.edit}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointDetailModal;
