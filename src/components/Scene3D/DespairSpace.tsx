import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Axes } from './Axes';
import { CharacterTrajectory } from './CharacterTrajectory';
import { useStore } from '../../store/useStore';
import { COLORS } from '../../utils/colorUtils';

const Scene: React.FC = () => {
  const characters = useStore((state) => state.characters);
  const selectedCharacterId = useStore((state) => state.selectedCharacterId);
  const hiddenCharacterIds = useStore((state) => state.hiddenCharacterIds);

  const visibleCharacters = characters.filter(
    (c) => !hiddenCharacterIds.includes(c.id)
  );

  return (
    <>
      {/* Освещение */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />

      {/* Оси координат */}
      <Axes />

      {/* Траектории персонажей */}
      {visibleCharacters.map((character) => (
        <CharacterTrajectory
          key={character.id}
          character={character}
          isSelected={character.id === selectedCharacterId}
        />
      ))}
    </>
  );
};

export const DespairSpace: React.FC = () => {
  const selectPoint = useStore((state) => state.selectPoint);
  const cancelConnecting = useStore((state) => state.cancelConnecting);

  const handlePointerMissed = () => {
    selectPoint(null);
    cancelConnecting();
  };

  return (
    <div className="w-full h-full">
      <Canvas
        style={{ background: COLORS.background }}
        gl={{ antialias: true }}
        onPointerMissed={handlePointerMissed}
      >
        <PerspectiveCamera
          makeDefault
          position={[1.5, 1.5, 1.5]}
          fov={50}
        />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={0.5}
          maxDistance={5}
          target={[0.5, 0.5, 0.5]}
        />
        <Scene />
      </Canvas>
    </div>
  );
};

export default DespairSpace;
