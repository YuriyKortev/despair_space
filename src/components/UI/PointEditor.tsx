import { useState, useEffect, useRef } from 'react';
import { useStore, useCharacterById } from '../../store/useStore';
import { VectorSliders } from './VectorSliders';
import { StageSelector } from './StageSelector';
import { generateLabel, generateDescription, getSuggestedAxisSubtypes } from '../../data/labels';
import { ZONE_DESCRIPTIONS, SUBTYPE_NAMES } from '../../data/descriptions';
import type {
  DespairVector,
  Stage,
  StageSubtype,
  DespairPoint,
  InfinitySubtype,
  FinitudeSubtype,
  NecessitySubtype,
  PossibilitySubtype,
  UnawarenessSubtype,
  AwarenessSubtype,
} from '../../types';

interface AxisSubtypes {
  infinityType?: InfinitySubtype;
  finitudeType?: FinitudeSubtype;
  necessityType?: NecessitySubtype;
  possibilityType?: PossibilitySubtype;
  unawarenessType?: UnawarenessSubtype;
  awarenessType?: AwarenessSubtype;
}

// Компонент для выбора подтипа оси
interface AxisSubtypeSelectorProps {
  title: string;
  subtitle: string;
  options: string[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  descriptions: Record<string, { short: string; full: string }>;
}

const AxisSubtypeSelector: React.FC<AxisSubtypeSelectorProps> = ({
  title,
  subtitle,
  options,
  value,
  onChange,
  descriptions,
}) => {
  return (
    <div className="p-3 bg-slate-800/50 rounded-lg">
      <div className="text-xs font-medium text-slate-400 mb-0.5">{title}</div>
      <div className="text-[10px] text-slate-500 mb-2">{subtitle}</div>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => {
          const isSelected = value === opt;
          const desc = descriptions[opt];
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(isSelected ? undefined : opt)}
              className={`
                px-2 py-1 rounded text-xs transition-all
                ${isSelected
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}
              `}
              title={desc?.short}
            >
              {SUBTYPE_NAMES[opt] || opt}
            </button>
          );
        })}
      </div>
      {value && descriptions[value] && (
        <div className="text-[10px] text-slate-400 mt-2 italic">
          {descriptions[value].short}
        </div>
      )}
    </div>
  );
};

interface PointEditorProps {
  characterId: string | null;
  pointId: string | null;
  onClose: () => void;
}

export const PointEditor: React.FC<PointEditorProps> = ({
  characterId,
  pointId,
  onClose,
}) => {
  const character = useCharacterById(characterId);
  const addPoint = useStore((state) => state.addPoint);
  const updatePoint = useStore((state) => state.updatePoint);
  const deletePoint = useStore((state) => state.deletePoint);

  const existingPoint = character?.points.find((p) => p.id === pointId);
  const isEditing = !!existingPoint;

  const [vector, setVector] = useState<DespairVector>({
    finiteInfinite: 0.5,
    necessityPossibility: 0.5,
    consciousness: 0.5,
  });
  const [stage, setStage] = useState<Stage>('aesthetic');
  const [stageSubtype, setStageSubtype] = useState<StageSubtype | undefined>();
  const [axisSubtypes, setAxisSubtypes] = useState<AxisSubtypes>({});
  const [momentName, setMomentName] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  // При редактировании сразу отключаем автогенерацию
  const [useAutoLabel, setUseAutoLabel] = useState(!isEditing);
  const [useAutoDescription, setUseAutoDescription] = useState(!isEditing);

  // Флаг завершения инициализации при редактировании
  const isInitializedRef = useRef(!isEditing);

  // Определяем какие подтипы осей показывать
  const suggestedAxes = getSuggestedAxisSubtypes(vector);

  useEffect(() => {
    if (existingPoint) {
      setVector(existingPoint.vector);
      setStage(existingPoint.stage);
      setStageSubtype(existingPoint.stageSubtype);
      setAxisSubtypes(existingPoint.axisSubtypes || {});
      setMomentName(existingPoint.momentName || '');
      setLabel(existingPoint.label);
      setDescription(existingPoint.description || '');
      setUseAutoLabel(false);
      setUseAutoDescription(!existingPoint.description);
      isInitializedRef.current = true;
    }
  }, [existingPoint]);

  // Трекинг предыдущих подтипов для детекции изменений
  const prevAxisSubtypesRef = useRef<string>('{}');

  // Автогенерация лейбла и описания
  useEffect(() => {
    // Пропускаем автогенерацию пока не завершена инициализация при редактировании
    if (!isInitializedRef.current) {
      return;
    }

    const tempPoint: DespairPoint = {
      id: 'temp',
      vector,
      stage,
      stageSubtype,
      axisSubtypes,
      label: '',
    };

    if (useAutoLabel) {
      setLabel(generateLabel(tempPoint));
    }
    if (useAutoDescription) {
      setDescription(generateDescription(tempPoint));
    }
  }, [vector, stage, stageSubtype, axisSubtypes, useAutoLabel, useAutoDescription]);

  // При изменении подтипов осей принудительно обновляем описание
  useEffect(() => {
    const currentStr = JSON.stringify(axisSubtypes);
    const hasSubtypes = Object.keys(axisSubtypes).length > 0;

    if (hasSubtypes && currentStr !== prevAxisSubtypesRef.current) {
      const tempPoint: DespairPoint = {
        id: 'temp',
        vector,
        stage,
        stageSubtype,
        axisSubtypes,
        label: '',
      };
      setDescription(generateDescription(tempPoint));
      setUseAutoDescription(true);
    }

    prevAxisSubtypesRef.current = currentStr;
  }, [axisSubtypes, vector, stage, stageSubtype]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!characterId) return;

    // Фильтруем axisSubtypes - оставляем только те, что соответствуют текущим координатам
    const filteredAxisSubtypes: AxisSubtypes = {};
    if (suggestedAxes.showInfinity && axisSubtypes.infinityType) {
      filteredAxisSubtypes.infinityType = axisSubtypes.infinityType;
    }
    if (suggestedAxes.showFinitude && axisSubtypes.finitudeType) {
      filteredAxisSubtypes.finitudeType = axisSubtypes.finitudeType;
    }
    if (suggestedAxes.showPossibility && axisSubtypes.possibilityType) {
      filteredAxisSubtypes.possibilityType = axisSubtypes.possibilityType;
    }
    if (suggestedAxes.showNecessity && axisSubtypes.necessityType) {
      filteredAxisSubtypes.necessityType = axisSubtypes.necessityType;
    }
    if (suggestedAxes.showUnawareness && axisSubtypes.unawarenessType) {
      filteredAxisSubtypes.unawarenessType = axisSubtypes.unawarenessType;
    }
    if (suggestedAxes.showAwareness && axisSubtypes.awarenessType) {
      filteredAxisSubtypes.awarenessType = axisSubtypes.awarenessType;
    }

    const pointData: Omit<DespairPoint, 'id'> = {
      vector,
      stage,
      stageSubtype,
      axisSubtypes: Object.keys(filteredAxisSubtypes).length > 0 ? filteredAxisSubtypes : undefined,
      label,
      // Сохраняем описание только если пользователь его изменил вручную
      description: !useAutoDescription && description.trim() ? description.trim() : undefined,
      momentName: momentName.trim() || undefined,
    };

    if (isEditing && pointId) {
      updatePoint(characterId, pointId, pointData);
    } else {
      addPoint(characterId, pointData);
    }

    onClose();
  };

  const handleDelete = () => {
    if (characterId && pointId && confirm('Удалить эту точку?')) {
      deletePoint(characterId, pointId);
      onClose();
    }
  };

  if (!character) {
    return (
      <div className="p-4 text-center text-slate-500">
        Сначала выберите персонажа
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6">
      {/* Название момента */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Название момента (опционально)
        </label>
        <input
          type="text"
          value={momentName}
          onChange={(e) => setMomentName(e.target.value)}
          placeholder="Например: До убийства"
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* Координаты */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Координаты в пространстве
        </label>
        <VectorSliders vector={vector} onChange={setVector} />
      </div>

      {/* Стадия */}
      <StageSelector
        stage={stage}
        subtype={stageSubtype}
        onStageChange={setStage}
        onSubtypeChange={setStageSubtype}
      />

      {/* Подтипы осей (появляются при экстремальных координатах) */}
      {(suggestedAxes.showInfinity || suggestedAxes.showFinitude ||
        suggestedAxes.showPossibility || suggestedAxes.showNecessity ||
        suggestedAxes.showUnawareness || suggestedAxes.showAwareness) && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">
            Подтипы отчаяния по осям
          </label>

          {/* Бесконечность */}
          {suggestedAxes.showInfinity && (
            <AxisSubtypeSelector
              title="Отчаяние бесконечности"
              subtitle="Координата X > 60%"
              options={['imagination', 'cognition', 'feeling', 'will'] as InfinitySubtype[]}
              value={axisSubtypes.infinityType}
              onChange={(v) => setAxisSubtypes({ ...axisSubtypes, infinityType: v as InfinitySubtype | undefined })}
              descriptions={ZONE_DESCRIPTIONS.infinite}
            />
          )}

          {/* Конечность */}
          {suggestedAxes.showFinitude && (
            <AxisSubtypeSelector
              title="Отчаяние конечности"
              subtitle="Координата X < 40%"
              options={['conformist', 'prudent'] as FinitudeSubtype[]}
              value={axisSubtypes.finitudeType}
              onChange={(v) => setAxisSubtypes({ ...axisSubtypes, finitudeType: v as FinitudeSubtype | undefined })}
              descriptions={ZONE_DESCRIPTIONS.finite}
            />
          )}

          {/* Возможность */}
          {suggestedAxes.showPossibility && (
            <AxisSubtypeSelector
              title="Отчаяние возможности"
              subtitle="Координата Y > 60%"
              options={['combinatorial', 'paralyzed'] as PossibilitySubtype[]}
              value={axisSubtypes.possibilityType}
              onChange={(v) => setAxisSubtypes({ ...axisSubtypes, possibilityType: v as PossibilitySubtype | undefined })}
              descriptions={ZONE_DESCRIPTIONS.possibility}
            />
          )}

          {/* Необходимость */}
          {suggestedAxes.showNecessity && (
            <AxisSubtypeSelector
              title="Отчаяние необходимости"
              subtitle="Координата Y < 40%"
              options={['fatalist', 'determinist'] as NecessitySubtype[]}
              value={axisSubtypes.necessityType}
              onChange={(v) => setAxisSubtypes({ ...axisSubtypes, necessityType: v as NecessitySubtype | undefined })}
              descriptions={ZONE_DESCRIPTIONS.necessity}
            />
          )}

          {/* Неведение */}
          {suggestedAxes.showUnawareness && (
            <AxisSubtypeSelector
              title="Неведение"
              subtitle="Координата Z < 40%"
              options={['naive', 'busy', 'denial'] as UnawarenessSubtype[]}
              value={axisSubtypes.unawarenessType}
              onChange={(v) => setAxisSubtypes({ ...axisSubtypes, unawarenessType: v as UnawarenessSubtype | undefined })}
              descriptions={ZONE_DESCRIPTIONS.unawareness}
            />
          )}

          {/* Осознанность (но не для religious + high awareness = спасение) */}
          {suggestedAxes.showAwareness && !(stage === 'religious' && vector.consciousness > 0.6) && (
            <AxisSubtypeSelector
              title="Осознанность"
              subtitle="Координата Z > 60%"
              options={['suffering', 'defiant'] as AwarenessSubtype[]}
              value={axisSubtypes.awarenessType}
              onChange={(v) => setAxisSubtypes({ ...axisSubtypes, awarenessType: v as AwarenessSubtype | undefined })}
              descriptions={ZONE_DESCRIPTIONS.awareness}
            />
          )}

          {/* Точка спасения */}
          {stage === 'religious' && vector.consciousness > 0.6 && (
            <div className="p-3 bg-amber-900/20 border border-amber-700/50 rounded-lg">
              <div className="text-sm text-amber-300 font-medium">🕊️ Точка спасения</div>
              <div className="text-xs text-amber-400/70 mt-1">
                Религиозная стадия с высокой осознанностью — это не отчаяние, а его преодоление
              </div>
            </div>
          )}
        </div>
      )}

      {/* Лейбл */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-slate-300">
            Краткий лейбл
          </label>
          <button
            type="button"
            onClick={() => {
              setUseAutoLabel(true);
              const tempPoint: DespairPoint = {
                id: 'temp',
                vector,
                stage,
                stageSubtype,
                axisSubtypes,
                label: '',
              };
              setLabel(generateLabel(tempPoint));
            }}
            className="text-xs text-violet-400 hover:text-violet-300"
          >
            Сгенерировать
          </button>
        </div>
        <input
          type="text"
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
            setUseAutoLabel(false);
          }}
          placeholder="Краткое описание состояния"
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          required
        />
      </div>

      {/* Описание */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-slate-300">
            Детальное описание
          </label>
          <button
            type="button"
            onClick={() => {
              setUseAutoDescription(true);
              const tempPoint: DespairPoint = {
                id: 'temp',
                vector,
                stage,
                stageSubtype,
                axisSubtypes,
                label: '',
              };
              setDescription(generateDescription(tempPoint));
            }}
            className="text-xs text-violet-400 hover:text-violet-300"
          >
            Сгенерировать
          </button>
        </div>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setUseAutoDescription(false);
          }}
          placeholder="Пользовательское описание (опционально, процедурное сгенерируется автоматически)"
          rows={6}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
        />
      </div>

      {/* Кнопки */}
      <div className="space-y-2 pt-2">
        <button
          type="submit"
          className="w-full py-2 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
        >
          {isEditing ? 'Сохранить' : 'Создать точку'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            className="w-full py-2 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
          >
            Удалить точку
          </button>
        )}
      </div>
    </form>
  );
};

export default PointEditor;
