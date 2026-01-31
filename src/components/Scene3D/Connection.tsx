import { useMemo } from 'react';
import { QuadraticBezierLine } from '@react-three/drei';
import * as THREE from 'three';
import type { Connection as ConnectionType, DespairPoint } from '../../types';
import { getConnectionColor } from '../../utils/colorUtils';

interface ConnectionProps {
  connection: ConnectionType;
  fromPoint: DespairPoint;
  toPoint: DespairPoint;
  isCharacterSelected: boolean;
}

export const Connection: React.FC<ConnectionProps> = ({
  connection,
  fromPoint,
  toPoint,
  isCharacterSelected,
}) => {
  const color = getConnectionColor(connection.transitionType);
  const opacity = isCharacterSelected ? 0.8 : 0.3;

  const startPos: [number, number, number] = [
    fromPoint.vector.finiteInfinite,
    fromPoint.vector.necessityPossibility,
    fromPoint.vector.consciousness,
  ];

  const endPos: [number, number, number] = [
    toPoint.vector.finiteInfinite,
    toPoint.vector.necessityPossibility,
    toPoint.vector.consciousness,
  ];

  // Вычисляем среднюю точку для кривой Безье
  const midPoint = useMemo(() => {
    const mid: [number, number, number] = [
      (startPos[0] + endPos[0]) / 2,
      (startPos[1] + endPos[1]) / 2,
      (startPos[2] + endPos[2]) / 2,
    ];

    // Добавляем небольшое смещение для кривизны
    const distance = Math.sqrt(
      Math.pow(endPos[0] - startPos[0], 2) +
        Math.pow(endPos[1] - startPos[1], 2) +
        Math.pow(endPos[2] - startPos[2], 2)
    );

    // Смещаем среднюю точку перпендикулярно линии
    const offset = distance * 0.15;
    mid[1] += offset;

    return mid;
  }, [startPos, endPos]);

  // Для кризиса делаем линию пунктирной
  const isDashed = connection.transitionType === 'crisis';

  // Линия с дополнительной толщиной для кризиса
  const lineWidth = connection.transitionType === 'crisis' ? 3 : 2;

  return (
    <group>
      {/* Основная линия */}
      <QuadraticBezierLine
        start={startPos}
        end={endPos}
        mid={midPoint}
        color={color}
        lineWidth={lineWidth}
        transparent
        opacity={opacity}
        dashed={isDashed}
        dashScale={isDashed ? 10 : 1}
        dashSize={isDashed ? 0.02 : 1}
        gapSize={isDashed ? 0.01 : 0}
      />

      {/* Стрелка на конце */}
      <ArrowHead
        end={endPos}
        mid={midPoint}
        color={color}
        opacity={opacity}
      />
    </group>
  );
};

interface ArrowHeadProps {
  end: [number, number, number];
  mid: [number, number, number];
  color: string;
  opacity: number;
}

const ArrowHead: React.FC<ArrowHeadProps> = ({ end, mid, color, opacity }) => {
  // Вычисляем направление к конечной точке от средней точки
  const direction = useMemo(() => {
    const dir = new THREE.Vector3(
      end[0] - mid[0],
      end[1] - mid[1],
      end[2] - mid[2]
    ).normalize();
    return dir;
  }, [end, mid]);

  // Вычисляем позицию и поворот стрелки
  const { position, rotation } = useMemo(() => {
    const pos = new THREE.Vector3(...end);
    // Смещаем немного назад от конечной точки
    pos.sub(direction.clone().multiplyScalar(0.02));

    // Вычисляем поворот
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    const euler = new THREE.Euler().setFromQuaternion(quaternion);

    return {
      position: [pos.x, pos.y, pos.z] as [number, number, number],
      rotation: [euler.x, euler.y, euler.z] as [number, number, number],
    };
  }, [end, direction]);

  return (
    <mesh position={position} rotation={rotation}>
      <coneGeometry args={[0.012, 0.03, 8]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
};

export default Connection;
