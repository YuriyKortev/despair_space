import { useStore } from '../../store/useStore';
import { CharacterCard } from './CharacterCard';

export const CharacterList: React.FC = () => {
  const characters = useStore((state) => state.characters);

  if (characters.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500">
        <svg
          className="w-12 h-12 mx-auto mb-3 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <p className="text-sm">Нет персонажей</p>
        <p className="text-xs mt-1">Создайте первого персонажа</p>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-1">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
};

export default CharacterList;
