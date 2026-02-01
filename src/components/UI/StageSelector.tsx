import type { Stage, StageSubtype } from '../../types';
import { STAGE_NAMES, STAGE_DESCRIPTIONS, SUBTYPE_NAMES } from '../../data/descriptions';
import { COLORS } from '../../utils/colorUtils';

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
  const stages: Stage[] = ['aesthetic', 'ethical', 'religious'];

  const handleStageChange = (newStage: Stage) => {
    onStageChange(newStage);
    onSubtypeChange(undefined);
  };

  return (
    <div className="space-y-4">
      {/* Выбор стадии */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Стадия существования
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
              {STAGE_NAMES[s]}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {STAGE_DESCRIPTIONS[stage].base.short}
        </p>
      </div>

      {/* Выбор подтипа */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Подтип стадии
        </label>
        <div className="space-y-1">
          {STAGE_SUBTYPES[stage].map((st) => {
            const desc = STAGE_DESCRIPTIONS[stage].subtypes[st];
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
                  {SUBTYPE_NAMES[st] || st}
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
