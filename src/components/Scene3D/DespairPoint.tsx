import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { DespairPoint as DespairPointType } from '../../types';
import { getStageColor, getPointSize } from '../../utils/colorUtils';
import { useStore } from '../../store/useStore';

interface DespairPointProps {
  point: DespairPointType;
  characterId: string;
  characterColor: string;
  isCharacterSelected: boolean;
}

export const DespairPoint: React.FC<DespairPointProps> = ({
  point,
  characterId,
  characterColor,
  isCharacterSelected,
}) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const selectedPointId = useStore((state) => state.selectedPointId);
  const isConnecting = useStore((state) => state.isConnecting);
  const connectFromPointId = useStore((state) => state.connectFromPointId);
  const selectPoint = useStore((state) => state.selectPoint);
  const openPointDetail = useStore((state) => state.openPointDetail);
  const connectPoints = useStore((state) => state.connectPoints);
  const startConnecting = useStore((state) => state.startConnecting);

  const isSelected = selectedPointId === point.id;
  const isConnectSource = connectFromPointId === point.id;

  // Позиция в 3D пространстве
  const position: [number, number, number] = [
    point.vector.finiteInfinite,
    point.vector.necessityPossibility,
    point.vector.consciousness,
  ];

  // Цвет точки
  const color = point.color || getStageColor(point.stage);
  const size = getPointSize(point.vector.consciousness);

  // Прозрачность
  const opacity = isCharacterSelected
    ? isSelected
      ? 1
      : hovered
      ? 0.9
      : 0.7
    : 0.4;

  // Анимация пульсации для выбранной точки
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      meshRef.current.scale.setScalar(scale);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();

    if (isConnecting && connectFromPointId && connectFromPointId !== point.id) {
      // Завершаем соединение
      connectPoints(characterId, connectFromPointId, point.id, 'evolution');
    } else if (e.nativeEvent.shiftKey && isCharacterSelected) {
      // Shift+клик — начинаем соединение
      startConnecting(point.id);
    } else {
      // Обычный клик — выбор точки
      selectPoint(point.id);
    }
  };

  const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    openPointDetail(point.id);
  };

  return (
    <group position={position}>
      {/* Основная сфера */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          depthWrite={false}
          emissive={isSelected || isConnectSource ? color : '#000000'}
          emissiveIntensity={isSelected ? 0.5 : isConnectSource ? 0.8 : 0}
        />
      </mesh>

      {/* Обводка для выбранной точки */}
      {isSelected && (
        <mesh>
          <sphereGeometry args={[size * 1.3, 32, 32]} />
          <meshBasicMaterial
            color={characterColor}
            transparent
            opacity={0.3}
            depthWrite={false}
            wireframe
          />
        </mesh>
      )}

      {/* Индикатор режима соединения */}
      {isConnectSource && (
        <mesh>
          <ringGeometry args={[size * 1.5, size * 1.8, 32]} />
          <meshBasicMaterial color="#22c55e" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Лейбл */}
      {(hovered || isSelected) && isCharacterSelected && (
        <Html
          position={[0, -size - 0.03, 0]}
          center
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div
            className="px-2 py-1 rounded text-xs whitespace-nowrap"
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              color: 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${color}`,
              maxWidth: '200px',
            }}
          >
            {point.momentName && (
              <div className="font-semibold text-[10px] opacity-70 mb-0.5">
                {point.momentName}
              </div>
            )}
            <div>{point.label}</div>
          </div>
        </Html>
      )}
    </group>
  );
};

export default DespairPoint;
