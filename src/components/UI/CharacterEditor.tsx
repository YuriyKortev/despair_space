import { useState, useEffect } from 'react';
import { useStore, useCharacterById } from '../../store/useStore';
import { CHARACTER_COLORS } from '../../utils/colorUtils';
import { PRESET_CHARACTERS } from '../../data/presets';
import type { CharacterCore } from '../../types';

interface CharacterEditorProps {
  characterId: string | null;
}

export const CharacterEditor: React.FC<CharacterEditorProps> = ({ characterId }) => {
  const character = useCharacterById(characterId);
  const addCharacter = useStore((state) => state.addCharacter);
  const updateCharacter = useStore((state) => state.updateCharacter);
  const closeCharacterEditor = useStore((state) => state.closeCharacterEditor);
  const importCharacter = useStore((state) => state.importCharacter);

  const [name, setName] = useState('');
  const [color, setColor] = useState(CHARACTER_COLORS[0]);
  const [history, setHistory] = useState<string[]>(['']);
  const [body, setBody] = useState('');
  const [gift, setGift] = useState('');

  const isEditing = !!character;

  useEffect(() => {
    if (character) {
      setName(character.name);
      setColor(character.color);
      setHistory(character.core.history.length > 0 ? character.core.history : ['']);
      setBody(character.core.body || '');
      setGift(character.core.gift || '');
    } else {
      setName('');
      setColor(CHARACTER_COLORS[Math.floor(Math.random() * CHARACTER_COLORS.length)]);
      setHistory(['']);
      setBody('');
      setGift('');
    }
  }, [character]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const core: CharacterCore = {
      history: history.filter((h) => h.trim()),
      body: body.trim() || undefined,
      gift: gift.trim() || undefined,
    };

    if (isEditing && characterId) {
      updateCharacter(characterId, { name, color, core });
    } else {
      const id = addCharacter(name, color);
      updateCharacter(id, { core });
    }

    closeCharacterEditor();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            importCharacter(data);
            closeCharacterEditor();
          } catch {
            alert('Ошибка при импорте файла');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const addHistoryItem = () => {
    setHistory([...history, '']);
  };

  const updateHistoryItem = (index: number, value: string) => {
    const newHistory = [...history];
    newHistory[index] = value;
    setHistory(newHistory);
  };

  const removeHistoryItem = (index: number) => {
    if (history.length > 1) {
      setHistory(history.filter((_, i) => i !== index));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          {isEditing ? 'Редактирование' : 'Новый персонаж'}
        </h2>
        <button
          type="button"
          onClick={closeCharacterEditor}
          className="p-1 hover:bg-slate-700 rounded"
        >
          <svg
            className="w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Имя */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Имя персонажа
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например: Раскольников"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>

        {/* Цвет */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Цвет траектории
          </label>
          <div className="flex flex-wrap gap-2">
            {CHARACTER_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-all ${
                  color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* История */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Ключевые события прошлого
          </label>
          <div className="space-y-2">
            {history.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateHistoryItem(index, e.target.value)}
                  placeholder="Событие..."
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button
                  type="button"
                  onClick={() => removeHistoryItem(index)}
                  className="p-2 hover:bg-slate-700 rounded-lg"
                  disabled={history.length === 1}
                >
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addHistoryItem}
              className="w-full py-2 border border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-colors"
            >
              + Добавить событие
            </button>
          </div>
        </div>

        {/* Тело */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Физическое описание
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Внешность, особенности..."
            rows={2}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          />
        </div>

        {/* Дар */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Талант / Способность
          </label>
          <input
            type="text"
            value={gift}
            onChange={(e) => setGift(e.target.value)}
            placeholder="Например: Ум, способность к теории"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      {/* Кнопки */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full py-2 px-4 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          {isEditing ? 'Сохранить' : 'Создать'}
        </button>
        {!isEditing && (
          <>
            <button
              type="button"
              onClick={handleImport}
              className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Импортировать из файла
            </button>
            {PRESET_CHARACTERS.length > 0 && (
              <div className="pt-2 border-t border-slate-700 mt-2">
                <p className="text-xs text-slate-500 mb-2">Загрузить пример:</p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_CHARACTERS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        importCharacter(preset);
                        closeCharacterEditor();
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sm text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: preset.color }}
                      />
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </form>
  );
};

export default CharacterEditor;
