import type { Character } from '../../types';
import { DespairPoint } from './DespairPoint';
import { Connection } from './Connection';

interface CharacterTrajectoryProps {
  character: Character;
  isSelected: boolean;
}

export const CharacterTrajectory: React.FC<CharacterTrajectoryProps> = ({
  character,
  isSelected,
}) => {
  // Создаём map точек для быстрого поиска
  const pointsMap = new Map(character.points.map((p) => [p.id, p]));

  return (
    <group>
      {/* Связи */}
      {character.connections.map((connection) => {
        const fromPoint = pointsMap.get(connection.fromPointId);
        const toPoint = pointsMap.get(connection.toPointId);

        if (!fromPoint || !toPoint) return null;

        return (
          <Connection
            key={connection.id}
            connection={connection}
            fromPoint={fromPoint}
            toPoint={toPoint}
            isCharacterSelected={isSelected}
          />
        );
      })}

      {/* Точки */}
      {character.points.map((point) => (
        <DespairPoint
          key={point.id}
          point={point}
          characterId={character.id}
          characterColor={character.color}
          isCharacterSelected={isSelected}
        />
      ))}
    </group>
  );
};

export default CharacterTrajectory;
