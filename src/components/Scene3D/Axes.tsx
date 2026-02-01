import { useMemo } from 'react';
import * as THREE from 'three';
import { Text, Line } from '@react-three/drei';
import { COLORS } from '../../utils/colorUtils';
import { useT } from '../../store/useLanguageStore';
import type { AxisConfig } from '../../types';

const AXIS_LENGTH = 1.2;
const LABEL_OFFSET = 0.15;

// Вычисляем ротацию для направления конуса в сторону оси
const getArrowRotation = (direction: [number, number, number]): [number, number, number] => {
  const [dx, dy, dz] = direction;
  // Конус по умолчанию направлен вверх (+Y)
  // Нужно повернуть его в направлении оси
  if (dx === 1) return [0, 0, -Math.PI / 2]; // X: повернуть на -90° вокруг Z
  if (dy === 1) return [0, 0, 0];             // Y: без поворота
  if (dz === 1) return [Math.PI / 2, 0, 0];   // Z: повернуть на 90° вокруг X
  return [0, 0, 0];
};

interface AxisProps {
  config: AxisConfig;
  direction: [number, number, number];
}

const Axis: React.FC<AxisProps> = ({ config, direction }) => {
  const [dx, dy, dz] = direction;
  const endPoint: [number, number, number] = [
    dx * AXIS_LENGTH,
    dy * AXIS_LENGTH,
    dz * AXIS_LENGTH,
  ];
  const startPoint: [number, number, number] = [
    -dx * AXIS_LENGTH * 0.1,
    -dy * AXIS_LENGTH * 0.1,
    -dz * AXIS_LENGTH * 0.1,
  ];

  const labelStartPos: [number, number, number] = [
    -dx * (AXIS_LENGTH * 0.1 + LABEL_OFFSET),
    -dy * (AXIS_LENGTH * 0.1 + LABEL_OFFSET),
    -dz * (AXIS_LENGTH * 0.1 + LABEL_OFFSET),
  ];

  const labelEndPos: [number, number, number] = [
    dx * (AXIS_LENGTH + LABEL_OFFSET),
    dy * (AXIS_LENGTH + LABEL_OFFSET),
    dz * (AXIS_LENGTH + LABEL_OFFSET),
  ];

  const arrowRotation = getArrowRotation(direction);

  return (
    <group>
      {/* Линия оси */}
      <Line
        points={[startPoint, endPoint]}
        color={config.color}
        lineWidth={2}
      />

      {/* Метки зон (0.4 и 0.6) */}
      {[0.4, 0.6].map((mark) => (
        <mesh
          key={mark}
          position={[dx * mark, dy * mark, dz * mark]}
        >
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshBasicMaterial color={config.color} opacity={0.5} transparent />
        </mesh>
      ))}

      {/* Подпись в начале */}
      <Text
        position={labelStartPos}
        fontSize={0.04}
        color={config.color}
        anchorX="center"
        anchorY="middle"
      >
        {config.labels.start}
      </Text>

      {/* Подпись в конце */}
      <Text
        position={labelEndPos}
        fontSize={0.04}
        color={config.color}
        anchorX="center"
        anchorY="middle"
      >
        {config.labels.end}
      </Text>

      {/* Стрелка на конце */}
      <mesh position={endPoint} rotation={arrowRotation}>
        <coneGeometry args={[0.015, 0.04, 8]} />
        <meshBasicMaterial color={config.color} />
      </mesh>
    </group>
  );
};

// Геометрия куба создаётся один раз
const unitBoxGeometry = new THREE.BoxGeometry(1, 1, 1);

export const Axes: React.FC = () => {
  const t = useT();

  const directions: [number, number, number][] = [
    [1, 0, 0], // X - finiteInfinite
    [0, 1, 0], // Y - necessityPossibility
    [0, 0, 1], // Z - consciousness
  ];

  const axisConfigs: AxisConfig[] = useMemo(() => [
    {
      name: 'finiteInfinite',
      color: COLORS.axes.finiteInfinite,
      labels: {
        start: t.axes.finite.toUpperCase(),
        end: t.axes.infinite.toUpperCase(),
      },
    },
    {
      name: 'necessityPossibility',
      color: COLORS.axes.necessityPossibility,
      labels: {
        start: t.axes.necessity.toUpperCase(),
        end: t.axes.possibility.toUpperCase(),
      },
    },
    {
      name: 'consciousness',
      color: COLORS.axes.consciousness,
      labels: {
        start: t.axes.unawareness.toUpperCase(),
        end: t.axes.awareness.toUpperCase(),
      },
    },
  ], [t]);

  // Создаём edgesGeometry один раз
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(unitBoxGeometry), []);

  return (
    <group>
      {axisConfigs.map((config, i) => (
        <Axis key={config.name} config={config} direction={directions[i]} />
      ))}

      {/* Куб единичного пространства (wireframe) - позиционирован в центр 0-1 */}
      <lineSegments position={[0.5, 0.5, 0.5]} geometry={edgesGeometry}>
        <lineBasicMaterial color="#ffffff" opacity={0.1} transparent />
      </lineSegments>

      {/* Полупрозрачный куб */}
      <mesh position={[0.5, 0.5, 0.5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ffffff" opacity={0.02} transparent depthWrite={false} />
      </mesh>
    </group>
  );
};

export default Axes;
