import type { DespairVector } from '../../types';
import { COLORS } from '../../utils/colorUtils';

interface VectorSlidersProps {
  vector: DespairVector;
  onChange: (vector: DespairVector) => void;
}

interface SliderConfig {
  key: keyof DespairVector;
  label: string;
  startLabel: string;
  endLabel: string;
  color: string;
}

const sliderConfigs: SliderConfig[] = [
  {
    key: 'finiteInfinite',
    label: 'Конечное ↔ Бесконечное',
    startLabel: 'Конечное',
    endLabel: 'Бесконечное',
    color: COLORS.axes.finiteInfinite,
  },
  {
    key: 'necessityPossibility',
    label: 'Необходимость ↔ Возможность',
    startLabel: 'Необходимость',
    endLabel: 'Возможность',
    color: COLORS.axes.necessityPossibility,
  },
  {
    key: 'consciousness',
    label: 'Неведение ↔ Осознанность',
    startLabel: 'Неведение',
    endLabel: 'Осознанность',
    color: COLORS.axes.consciousness,
  },
];

export const VectorSliders: React.FC<VectorSlidersProps> = ({
  vector,
  onChange,
}) => {
  const handleChange = (key: keyof DespairVector, value: number) => {
    onChange({ ...vector, [key]: value });
  };

  return (
    <div className="space-y-4">
      {sliderConfigs.map((config) => (
        <div key={config.key}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">{config.startLabel}</span>
            <span className="text-slate-300 font-medium">
              {Math.round(vector[config.key] * 100)}%
            </span>
            <span className="text-slate-400">{config.endLabel}</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={vector[config.key]}
              onChange={(e) => handleChange(config.key, parseFloat(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right,
                  ${config.color}33 0%,
                  ${config.color}33 ${vector[config.key] * 100}%,
                  #334155 ${vector[config.key] * 100}%,
                  #334155 100%)`,
              }}
            />
            {/* Маркеры зон (0.4 и 0.6) */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-slate-500 pointer-events-none"
              style={{ left: '40%' }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-slate-500 pointer-events-none"
              style={{ left: '60%' }}
            />
          </div>
          {/* Индикатор зоны */}
          <div className="text-xs text-center mt-1" style={{ color: config.color }}>
            {vector[config.key] < 0.4 && config.startLabel}
            {vector[config.key] > 0.6 && config.endLabel}
            {vector[config.key] >= 0.4 && vector[config.key] <= 0.6 && 'Баланс'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VectorSliders;
