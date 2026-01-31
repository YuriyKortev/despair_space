import type { Character } from '../../types';
import { useStore } from '../../store/useStore';

interface CharacterCardProps {
  character: Character;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const selectedCharacterId = useStore((state) => state.selectedCharacterId);
  const selectCharacter = useStore((state) => state.selectCharacter);
  const openCharacterEditor = useStore((state) => state.openCharacterEditor);
  const deleteCharacter = useStore((state) => state.deleteCharacter);
  const exportCharacter = useStore((state) => state.exportCharacter);

  const isSelected = selectedCharacterId === character.id;

  const handleExport = (e: React.MouseEvent) => {
    e.stopPropagation();
    const data = exportCharacter(character.id);
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${character.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Удалить персонажа "${character.name}"?`)) {
      deleteCharacter(character.id);
    }
  };

  return (
    <div
      onClick={() => selectCharacter(character.id)}
      className={`
        p-3 rounded-lg cursor-pointer transition-all
        ${
          isSelected
            ? 'bg-slate-700 ring-1 ring-violet-500'
            : 'bg-slate-800 hover:bg-slate-700/70'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: character.color }}
        />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-white truncate">{character.name}</div>
          <div className="text-xs text-slate-400">
            {character.points.length} точек · {character.connections.length} связей
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openCharacterEditor(character.id);
            }}
            className="p-1.5 hover:bg-slate-600 rounded transition-colors"
            title="Редактировать"
          >
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={handleExport}
            className="p-1.5 hover:bg-slate-600 rounded transition-colors"
            title="Экспортировать"
          >
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-600/50 rounded transition-colors"
            title="Удалить"
          >
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
