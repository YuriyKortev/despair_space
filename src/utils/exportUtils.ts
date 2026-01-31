import type { Character } from '../types';

// Экспорт персонажа в JSON файл
export const exportCharacterToFile = (character: Character): void => {
  const data = JSON.stringify(character, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${character.name.toLowerCase().replace(/\s+/g, '-')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Импорт персонажа из файла
export const importCharacterFromFile = (): Promise<Character | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string) as Character;

          // Валидация базовой структуры
          if (!data.id || !data.name || !Array.isArray(data.points)) {
            throw new Error('Invalid character structure');
          }

          resolve(data);
        } catch (error) {
          console.error('Failed to parse character file:', error);
          resolve(null);
        }
      };

      reader.onerror = () => {
        console.error('Failed to read file');
        resolve(null);
      };

      reader.readAsText(file);
    };

    input.click();
  });
};

// Экспорт всех персонажей
export const exportAllCharacters = (characters: Character[]): void => {
  const data = JSON.stringify(characters, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'despair-space-characters.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Копирование текста в буфер обмена
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);

    // Fallback для старых браузеров
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
};
