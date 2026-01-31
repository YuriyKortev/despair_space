import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  Store,
  Character,
  DespairPoint,
  Connection,
  ViewMode,
} from '../types';
import { generateCharacterColor } from '../utils/colorUtils';

const initialState = {
  characters: [],
  selectedCharacterId: null,
  selectedPointId: null,
  viewMode: '3d' as ViewMode,
  isAddingPoint: false,
  isConnecting: false,
  connectFromPointId: null,
  showPointDetail: false,
  editingPointId: null,
  showCharacterEditor: false,
  editingCharacterId: null,
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ===== ПЕРСОНАЖИ =====

      addCharacter: (name: string, color?: string) => {
        const id = uuidv4();
        const newCharacter: Character = {
          id,
          name,
          color: color || generateCharacterColor(),
          core: {
            history: [],
          },
          points: [],
          connections: [],
          rootPointId: null,
        };

        set((state) => ({
          characters: [...state.characters, newCharacter],
          selectedCharacterId: id,
        }));

        return id;
      },

      updateCharacter: (id, updates) => {
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteCharacter: (id) => {
        set((state) => ({
          characters: state.characters.filter((c) => c.id !== id),
          selectedCharacterId:
            state.selectedCharacterId === id ? null : state.selectedCharacterId,
          selectedPointId: null,
        }));
      },

      // ===== ТОЧКИ =====

      addPoint: (characterId, point) => {
        const pointId = uuidv4();
        const newPoint: DespairPoint = {
          ...point,
          id: pointId,
        };

        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== characterId) return c;
            const isFirstPoint = c.points.length === 0;
            return {
              ...c,
              points: [...c.points, newPoint],
              rootPointId: isFirstPoint ? pointId : c.rootPointId,
            };
          }),
          selectedPointId: pointId,
          isAddingPoint: false,
        }));

        return pointId;
      },

      updatePoint: (characterId, pointId, updates) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== characterId) return c;
            return {
              ...c,
              points: c.points.map((p) =>
                p.id === pointId ? { ...p, ...updates } : p
              ),
            };
          }),
        }));
      },

      deletePoint: (characterId, pointId) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== characterId) return c;
            return {
              ...c,
              points: c.points.filter((p) => p.id !== pointId),
              connections: c.connections.filter(
                (conn) => conn.fromPointId !== pointId && conn.toPointId !== pointId
              ),
              rootPointId: c.rootPointId === pointId ? null : c.rootPointId,
            };
          }),
          selectedPointId:
            state.selectedPointId === pointId ? null : state.selectedPointId,
        }));
      },

      // ===== СВЯЗИ =====

      connectPoints: (characterId, fromId, toId, type, crisis) => {
        const connectionId = uuidv4();
        const newConnection: Connection = {
          id: connectionId,
          fromPointId: fromId,
          toPointId: toId,
          transitionType: type,
          crisis,
        };

        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== characterId) return c;
            // Проверяем, нет ли уже такой связи
            const exists = c.connections.some(
              (conn) => conn.fromPointId === fromId && conn.toPointId === toId
            );
            if (exists) return c;
            return {
              ...c,
              connections: [...c.connections, newConnection],
            };
          }),
          isConnecting: false,
          connectFromPointId: null,
        }));
      },

      deleteConnection: (characterId, connectionId) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== characterId) return c;
            return {
              ...c,
              connections: c.connections.filter((conn) => conn.id !== connectionId),
            };
          }),
        }));
      },

      // ===== ВЫБОР =====

      selectCharacter: (id) => {
        set({
          selectedCharacterId: id,
          selectedPointId: null,
        });
      },

      selectPoint: (id) => {
        set({ selectedPointId: id });
      },

      // ===== UI =====

      setViewMode: (mode) => {
        set({ viewMode: mode });
      },

      setAddingPoint: (value) => {
        set({ isAddingPoint: value });
      },

      startConnecting: (fromPointId) => {
        set({
          isConnecting: true,
          connectFromPointId: fromPointId,
        });
      },

      cancelConnecting: () => {
        set({
          isConnecting: false,
          connectFromPointId: null,
        });
      },

      // ===== МОДАЛКИ =====

      openPointDetail: (pointId) => {
        set({
          showPointDetail: true,
          selectedPointId: pointId,
        });
      },

      closePointDetail: () => {
        set({ showPointDetail: false });
      },

      openPointEditor: (pointId) => {
        set({ editingPointId: pointId });
      },

      closePointEditor: () => {
        set({ editingPointId: null });
      },

      openCharacterEditor: (characterId) => {
        set({
          showCharacterEditor: true,
          editingCharacterId: characterId,
        });
      },

      closeCharacterEditor: () => {
        set({
          showCharacterEditor: false,
          editingCharacterId: null,
        });
      },

      // ===== IMPORT/EXPORT =====

      importCharacter: (character) => {
        // Генерируем новые ID для избежания конфликтов
        const newId = uuidv4();
        const pointIdMap = new Map<string, string>();

        const newPoints = character.points.map((p) => {
          const newPointId = uuidv4();
          pointIdMap.set(p.id, newPointId);
          return { ...p, id: newPointId };
        });

        const newConnections = character.connections.map((c) => ({
          ...c,
          id: uuidv4(),
          fromPointId: pointIdMap.get(c.fromPointId) || c.fromPointId,
          toPointId: pointIdMap.get(c.toPointId) || c.toPointId,
        }));

        const newRootPointId = character.rootPointId
          ? pointIdMap.get(character.rootPointId) || null
          : null;

        const importedCharacter: Character = {
          ...character,
          id: newId,
          points: newPoints,
          connections: newConnections,
          rootPointId: newRootPointId,
        };

        set((state) => ({
          characters: [...state.characters, importedCharacter],
          selectedCharacterId: newId,
        }));
      },

      exportCharacter: (id) => {
        const state = get();
        return state.characters.find((c) => c.id === id) || null;
      },
    }),
    {
      name: 'despair-space-storage',
      partialize: (state) => ({
        characters: state.characters,
      }),
    }
  )
);

// ===== СЕЛЕКТОРЫ =====

export const useSelectedCharacter = () => {
  return useStore((state) => {
    if (!state.selectedCharacterId) return null;
    return state.characters.find((c) => c.id === state.selectedCharacterId) || null;
  });
};

export const useSelectedPoint = () => {
  return useStore((state) => {
    if (!state.selectedCharacterId || !state.selectedPointId) return null;
    const character = state.characters.find((c) => c.id === state.selectedCharacterId);
    if (!character) return null;
    return character.points.find((p) => p.id === state.selectedPointId) || null;
  });
};

export const useCharacterById = (id: string | null) => {
  return useStore((state) => {
    if (!id) return null;
    return state.characters.find((c) => c.id === id) || null;
  });
};
