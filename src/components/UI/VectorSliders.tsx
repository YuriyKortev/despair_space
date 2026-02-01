import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  tooltip: {
    description: string;
    lowExample: string;
    highExample: string;
  };
}

const sliderConfigs: SliderConfig[] = [
  {
    key: 'finiteInfinite',
    label: 'Конечное ↔ Бесконечное',
    startLabel: 'Конечное',
    endLabel: 'Бесконечное',
    color: COLORS.axes.finiteInfinite,
    tooltip: {
      description: 'Ось самости: потеря себя в мире vs потеря мира в себе',
      lowExample: 'Низко (конечное): конформизм, растворение в социуме, «как все», узкое благоразумие',
      highExample: 'Высоко (бесконечное): фантазии, абстрактные идеалы, грандиозные планы без реализации',
    },
  },
  {
    key: 'necessityPossibility',
    label: 'Необходимость ↔ Возможность',
    startLabel: 'Необходимость',
    endLabel: 'Возможность',
    color: COLORS.axes.necessityPossibility,
    tooltip: {
      description: 'Ось свободы: детерминизм vs паралич выбора',
      lowExample: 'Низко (необходимость): фатализм, «всё предопределено», подчинение обстоятельствам',
      highExample: 'Высоко (возможность): бесконечный перебор вариантов, неспособность выбрать, паралич',
    },
  },
  {
    key: 'consciousness',
    label: 'Неведение ↔ Осознанность',
    startLabel: 'Неведение',
    endLabel: 'Осознанность',
    color: COLORS.axes.consciousness,
    tooltip: {
      description: 'Ось глубины: понимание своего экзистенциального состояния',
      lowExample: 'Низко (неведение): не знает о своём отчаянии, наивность, бегство в занятость',
      highExample: 'Высоко (осознанность): видит своё отчаяние, страдание или демоническое упрямство',
    },
  },
];

// Компонент тултипа с вопросиком (рендерится через портал)
const AxisTooltip: React.FC<{
  tooltip: SliderConfig['tooltip'];
  color: string;
}> = ({ tooltip, color }) => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 8, // отступ от кнопки
        left: rect.left + rect.width / 2,
      });
    }
    setIsVisible(true);
  };

  return (
    <div className="relative inline-block ml-1.5">
      <button
        ref={buttonRef}
        type="button"
        className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center transition-colors cursor-help"
        style={{
          backgroundColor: isVisible ? color : 'transparent',
          border: `1px solid ${color}`,
          color: isVisible ? '#0f172a' : color,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={handleMouseEnter}
        onBlur={() => setIsVisible(false)}
      >
        ?
      </button>
      {isVisible && createPortal(
        <div
          className="fixed w-64 p-3 rounded-lg shadow-xl text-xs pointer-events-none"
          style={{
            backgroundColor: '#1e293b',
            border: `1px solid ${color}50`,
            zIndex: 99999,
            top: position.top,
            left: position.left,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="text-slate-200 font-medium mb-2">{tooltip.description}</div>
          <div className="space-y-1.5 text-[11px]">
            <div className="text-slate-400">
              <span className="text-red-400">↓</span> {tooltip.lowExample}
            </div>
            <div className="text-slate-400">
              <span className="text-green-400">↑</span> {tooltip.highExample}
            </div>
          </div>
          {/* Стрелка */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: `6px solid ${color}50`,
            }}
          />
        </div>,
        document.body
      )}
    </div>
  );
};

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
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-400 flex items-center">
              {config.startLabel}
              <AxisTooltip tooltip={config.tooltip} color={config.color} />
            </span>
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
