import { useState, useEffect } from 'react';
import { useStore, useCharacterById } from '../../store/useStore';
import { VectorSliders } from './VectorSliders';
import { StageSelector } from './StageSelector';
import { generateLabel, generateDescription } from '../../data/labels';
import type { DespairVector, Stage, StageSubtype, DespairPoint } from '../../types';

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
  const [momentName, setMomentName] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [useAutoLabel, setUseAutoLabel] = useState(true);
  const [useAutoDescription, setUseAutoDescription] = useState(true);

  useEffect(() => {
    if (existingPoint) {
      setVector(existingPoint.vector);
      setStage(existingPoint.stage);
      setStageSubtype(existingPoint.stageSubtype);
      setMomentName(existingPoint.momentName || '');
      setLabel(existingPoint.label);
      setDescription(existingPoint.description);
      setUseAutoLabel(false);
      setUseAutoDescription(false);
    }
  }, [existingPoint]);

  // Автогенерация лейбла и описания
  useEffect(() => {
    const tempPoint: DespairPoint = {
      id: 'temp',
      vector,
      stage,
      stageSubtype,
      label: '',
      description: '',
    };

    if (useAutoLabel) {
      setLabel(generateLabel(tempPoint));
    }
    if (useAutoDescription) {
      setDescription(generateDescription(tempPoint));
    }
  }, [vector, stage, stageSubtype, useAutoLabel, useAutoDescription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!characterId) return;

    const pointData: Omit<DespairPoint, 'id'> = {
      vector,
      stage,
      stageSubtype,
      label,
      description,
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
                label: '',
                description: '',
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
                label: '',
                description: '',
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
          placeholder="Подробное описание экзистенциального состояния"
          rows={6}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          required
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
