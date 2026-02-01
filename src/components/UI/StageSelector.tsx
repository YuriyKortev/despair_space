import type { Stage, StageSubtype } from '../../types';
import { COLORS } from '../../utils/colorUtils';
import { useT, useDescriptions } from '../../store/useLanguageStore';

interface StageSelectorProps {
  stage: Stage;
  subtype?: StageSubtype;
  onStageChange: (stage: Stage) => void;
  onSubtypeChange: (subtype: StageSubtype | undefined) => void;
}

const STAGE_SUBTYPES: Record<Stage, readonly string[]> = {
  aesthetic: ['sensual', 'romantic', 'intellectual'] as const,
  ethical: ['civic', 'heroic'] as const,
  religious: ['immanent', 'paradoxical'] as const,
};

export const StageSelector: React.FC<StageSelectorProps> = ({
  stage,
  subtype,
  onStageChange,
  onSubtypeChange,
}) => {
  const t = useT();
  const descriptions = useDescriptions();
  const stages: Stage[] = ['aesthetic', 'ethical', 'religious'];

  const stageNames: Record<Stage, string> = {
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

  const handleStageChange = (newStage: Stage) => {
    onStageChange(newStage);
    onSubtypeChange(undefined);
  };

  return (
    <div className="space-y-4">
      {/* Выбор стадии */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {t.stages.title}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {stages.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStageChange(s)}
              className={`
                py-2 px-3 rounded-lg text-sm transition-all border-2
                ${
                  stage === s
                    ? 'border-current'
                    : 'bg-slate-800 hover:bg-slate-700 border-transparent'
                }
              `}
              style={{
                backgroundColor: stage === s ? COLORS.stages[s] : undefined,
                color: stage === s ? '#000' : '#fff',
                borderColor: stage === s ? COLORS.stages[s] : undefined,
              }}
            >
              {stageNames[s]}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {descriptions.stages[stage].base.short}
        </p>
      </div>

      {/* Выбор подтипа */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {t.stages.title}
        </label>
        <div className="space-y-1">
          {STAGE_SUBTYPES[stage].map((st) => {
            // Access subtype descriptions safely
            const stageDescriptions = descriptions.stages[stage];
            const subtypeKey = st as keyof typeof stageDescriptions.subtypes;
            const desc = stageDescriptions.subtypes[subtypeKey] as { short: string; full: string } | undefined;
            return (
              <button
                key={st}
                type="button"
                onClick={() =>
                  onSubtypeChange(subtype === st ? undefined : (st as StageSubtype))
                }
                className={`
                  w-full text-left p-2 rounded-lg text-sm transition-all border
                  ${
                    subtype === st
                      ? 'bg-slate-700'
                      : 'bg-slate-800 hover:bg-slate-700/70 border-transparent'
                  }
                `}
                style={{
                  borderColor: subtype === st ? COLORS.stages[stage] : 'transparent',
                }}
              >
                <div className="font-medium text-white">
                  {subtypeNames[st] || st}
                </div>
                {desc && (
                  <div className="text-xs text-slate-400 mt-0.5">{desc.short}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StageSelector;
