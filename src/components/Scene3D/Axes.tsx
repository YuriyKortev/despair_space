import { Text, Line } from '@react-three/drei';
import { COLORS } from '../../utils/colorUtils';
import type { AxisConfig } from '../../types';

const AXIS_LENGTH = 1.2;
const LABEL_OFFSET = 0.15;

const axisConfigs: AxisConfig[] = [
  {
    name: 'finiteInfinite',
    color: COLORS.axes.finiteInfinite,
    labels: {
      start: 'КОНЕЧНОЕ',
      end: 'БЕСКОНЕЧНОЕ',
    },
  },
  {
    name: 'necessityPossibility',
    color: COLORS.axes.necessityPossibility,
    labels: {
      start: 'НЕОБХОДИМОСТЬ',
      end: 'ВОЗМОЖНОСТЬ',
    },
  },
  {
    name: 'consciousness',
    color: COLORS.axes.consciousness,
    labels: {
      start: 'НЕВЕДЕНИЕ',
      end: 'ОСОЗНАННОСТЬ',
    },
  },
];

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
        font="/fonts/Inter-Regular.woff"
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
        font="/fonts/Inter-Regular.woff"
      >
        {config.labels.end}
      </Text>

      {/* Стрелка на конце */}
      <mesh position={endPoint} rotation={[0, 0, Math.atan2(dy, dx)]}>
        <coneGeometry args={[0.015, 0.04, 8]} />
        <meshBasicMaterial color={config.color} />
      </mesh>
    </group>
  );
};

export const Axes: React.FC = () => {
  const directions: [number, number, number][] = [
    [1, 0, 0], // X - finiteInfinite
    [0, 1, 0], // Y - necessityPossibility
    [0, 0, 1], // Z - consciousness
  ];

  return (
    <group>
      {axisConfigs.map((config, i) => (
        <Axis key={config.name} config={config} direction={directions[i]} />
      ))}

      {/* Куб единичного пространства (wireframe) */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial color="#ffffff" opacity={0.1} transparent />
      </lineSegments>
      <mesh position={[0.5, 0.5, 0.5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ffffff" opacity={0.02} transparent />
      </mesh>
    </group>
  );
};

// Нужен импорт THREE для BoxGeometry
import * as THREE from 'three';

export default Axes;
