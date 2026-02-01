import { useCallback } from 'react';
import { useStore } from '../../store/useStore';
import { useT } from '../../store/useLanguageStore';
import { CharacterList } from '../UI/CharacterList';
import { CharacterEditor } from '../UI/CharacterEditor';
import { LanguageSelector } from '../UI/LanguageSelector';

export const Sidebar: React.FC = () => {
  const t = useT();
  // Предотвращаем перехват событий Canvas/OrbitControls
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
  }, []);
  const showCharacterEditor = useStore((state) => state.showCharacterEditor);
  const editingCharacterId = useStore((state) => state.editingCharacterId);
  const openCharacterEditor = useStore((state) => state.openCharacterEditor);

  return (
    <div
      className="w-80 h-full bg-slate-900 border-r border-slate-700 flex flex-col relative z-10"
      onPointerDown={handlePointerDown}
    >
      {/* Заголовок */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">
              {t.appTitle}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {t.appSubtitle}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <LanguageSelector />
        </div>
      </div>

      {/* Контент */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {showCharacterEditor ? (
          <CharacterEditor characterId={editingCharacterId} />
        ) : (
          <>
            {/* Список персонажей */}
            <div className="flex-1 overflow-y-auto">
              <CharacterList />
            </div>

            {/* Кнопка добавления */}
            <div className="p-4 border-t border-slate-700">
              <button
                onClick={() => openCharacterEditor(null)}
                className="w-full py-2 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {t.characters.addCharacter}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
