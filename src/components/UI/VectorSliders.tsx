import { useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { DespairVector } from '../../types';
import { COLORS } from '../../utils/colorUtils';
import { useT } from '../../store/useLanguageStore';

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
  const t = useT();

  const sliderConfigs = useMemo<SliderConfig[]>(() => [
    {
      key: 'finiteInfinite',
      label: t.axes.finiteInfinite,
      startLabel: t.axes.finite,
      endLabel: t.axes.infinite,
      color: COLORS.axes.finiteInfinite,
      tooltip: {
        description: t.axes.finiteInfinite,
        lowExample: `${t.axes.finite}: ${t.axisSubtypes.conformist}, ${t.axisSubtypes.prudent}`,
        highExample: `${t.axes.infinite}: ${t.axisSubtypes.imagination}, ${t.axisSubtypes.will}`,
      },
    },
    {
      key: 'necessityPossibility',
      label: t.axes.necessityPossibility,
      startLabel: t.axes.necessity,
      endLabel: t.axes.possibility,
      color: COLORS.axes.necessityPossibility,
      tooltip: {
        description: t.axes.necessityPossibility,
        lowExample: `${t.axes.necessity}: ${t.axisSubtypes.fatalist}, ${t.axisSubtypes.determinist}`,
        highExample: `${t.axes.possibility}: ${t.axisSubtypes.combinatorial}, ${t.axisSubtypes.paralyzed}`,
      },
    },
    {
      key: 'consciousness',
      label: `${t.axes.unawareness} ↔ ${t.axes.awareness}`,
      startLabel: t.axes.unawareness,
      endLabel: t.axes.awareness,
      color: COLORS.axes.consciousness,
      tooltip: {
        description: t.axes.consciousness,
        lowExample: `${t.axes.unawareness}: ${t.axisSubtypes.naive}, ${t.axisSubtypes.busy}, ${t.axisSubtypes.denial}`,
        highExample: `${t.axes.awareness}: ${t.axisSubtypes.suffering}, ${t.axisSubtypes.defiant}`,
      },
    },
  ], [t]);

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
            {vector[config.key] >= 0.4 && vector[config.key] <= 0.6 && t.axes.balance}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VectorSliders;
