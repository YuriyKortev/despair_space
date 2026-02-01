// ===== БАЗОВЫЕ ТИПЫ =====

export type Stage = 'aesthetic' | 'ethical' | 'religious';

export type AestheticSubtype =
  | 'sensual'           // чувственный Дон Жуан
  | 'romantic'          // романтик-мечтатель
  | 'intellectual';     // эстетик-интеллектуал

export type EthicalSubtype =
  | 'civic'             // гражданственный долг
  | 'heroic';           // трагический герой

export type ReligiousSubtype =
  | 'immanent'          // имманентная религиозность
  | 'paradoxical';      // парадоксальная вера

export type StageSubtype = AestheticSubtype | EthicalSubtype | ReligiousSubtype;

// Подтипы для осей
export type InfinitySubtype =
  | 'imagination'       // потерялся в фантазиях
  | 'cognition'         // потерялся в познании
  | 'feeling'           // абстрактные чувства ("люблю человечество")
  | 'will';             // грандиозные планы без действий

export type FinitudeSubtype =
  | 'conformist'        // делает "как все"
  | 'prudent';          // узкое благоразумие

export type NecessitySubtype =
  | 'fatalist'          // всё предопределено
  | 'determinist';      // научный детерминизм

export type PossibilitySubtype =
  | 'combinatorial'     // комбинаторные фантазии
  | 'paralyzed';        // паралич от возможностей

// Подтипы осознанности
export type UnawarenessSubtype =
  | 'naive'             // наивное неведение
  | 'busy'              // занятость как бегство
  | 'denial';           // активное отрицание

export type AwarenessSubtype =
  | 'suffering'         // страдающее осознание
  | 'defiant';          // дерзкое осознание

// ===== ВЕКТОР В ПРОСТРАНСТВЕ =====

export interface DespairVector {
  finiteInfinite: number;        // 0 = конечное, 1 = бесконечное
  necessityPossibility: number;  // 0 = необходимость, 1 = возможность
  consciousness: number;         // 0 = неведение, 1 = полная осознанность
}

// ===== ТОЧКА В ПРОСТРАНСТВЕ =====

export interface DespairPoint {
  id: string;

  // Координаты в пространстве (0.0 - 1.0)
  vector: DespairVector;

  // Стадия существования
  stage: Stage;
  stageSubtype?: StageSubtype;

  // Подтипы осей (определяются автоматически по координатам, можно переопределить)
  axisSubtypes?: {
    infinityType?: InfinitySubtype;       // если finiteInfinite > 0.6
    finitudeType?: FinitudeSubtype;       // если finiteInfinite < 0.4
    necessityType?: NecessitySubtype;     // если necessityPossibility < 0.4
    possibilityType?: PossibilitySubtype; // если necessityPossibility > 0.6
    unawarenessType?: UnawarenessSubtype; // если consciousness < 0.4
    awarenessType?: AwarenessSubtype;     // если consciousness > 0.6
  };

  // Метаданные
  label: string;              // краткий лейбл (под точкой)
  description?: string;       // пользовательское описание (опционально)
  momentName?: string;        // название момента в сюжете ("до убийства", "признание")

  // Визуал
  color?: string;             // цвет точки (по умолчанию из стадии)
}

// ===== СВЯЗЬ МЕЖДУ ТОЧКАМИ =====

export type TransitionType = 'evolution' | 'crisis' | 'branch';

export interface Connection {
  id: string;
  fromPointId: string;
  toPointId: string;

  // Тип перехода
  transitionType: TransitionType;

  // Для кризиса
  crisis?: {
    trigger: string;           // что вызвало кризис
    alternatives?: string[];   // какие были альтернативы
  };
}

// ===== ЯДРО ПЕРСОНАЖА =====

export interface CharacterCore {
  history: string[];         // ключевые события прошлого
  body?: string;             // физическое описание
  gift?: string;             // талант/способность
}

// ===== ПЕРСОНАЖ =====

export interface Character {
  id: string;
  name: string;

  // Ядро (неизменное)
  core: CharacterCore;

  // Граф состояний
  points: DespairPoint[];
  connections: Connection[];

  // Корень графа (начальная точка)
  rootPointId: string | null;

  // Визуал
  color: string;               // основной цвет траектории
}

// ===== СОСТОЯНИЕ ПРИЛОЖЕНИЯ =====

export type ViewMode = '3d' | 'detail';

export interface AppState {
  characters: Character[];
  selectedCharacterId: string | null;
  selectedPointId: string | null;
  hiddenCharacterIds: string[];

  // UI состояние
  viewMode: ViewMode;
  isAddingPoint: boolean;
  isConnecting: boolean;
  connectFromPointId: string | null;

  // Модалки
  showPointDetail: boolean;
  editingPointId: string | null;
  showCharacterEditor: boolean;
  editingCharacterId: string | null;
  showPathDetail: boolean;
  pathDetailPointId: string | null;
  editingConnectionId: string | null;
}

export interface AppActions {
  // Персонажи
  addCharacter: (name: string, color?: string) => string;
  updateCharacter: (id: string, updates: Partial<Omit<Character, 'id'>>) => void;
  deleteCharacter: (id: string) => void;

  // Точки
  addPoint: (characterId: string, point: Omit<DespairPoint, 'id'>) => string;
  updatePoint: (characterId: string, pointId: string, updates: Partial<Omit<DespairPoint, 'id'>>) => void;
  deletePoint: (characterId: string, pointId: string) => void;

  // Связи
  connectPoints: (characterId: string, fromId: string, toId: string, type: TransitionType, crisis?: Connection['crisis']) => void;
  updateConnection: (characterId: string, connectionId: string, updates: Partial<Omit<Connection, 'id' | 'fromPointId' | 'toPointId'>>) => void;
  deleteConnection: (characterId: string, connectionId: string) => void;

  // Выбор
  selectCharacter: (id: string | null) => void;
  selectPoint: (id: string | null) => void;

  // UI
  setViewMode: (mode: ViewMode) => void;
  setAddingPoint: (value: boolean) => void;
  startConnecting: (fromPointId: string) => void;
  cancelConnecting: () => void;
  toggleCharacterVisibility: (id: string) => void;

  // Модалки
  openPointDetail: (pointId: string) => void;
  closePointDetail: () => void;
  openPointEditor: (pointId: string | null) => void;
  closePointEditor: () => void;
  openCharacterEditor: (characterId: string | null) => void;
  closeCharacterEditor: () => void;
  openPathDetail: (pointId: string) => void;
  closePathDetail: () => void;
  openConnectionEditor: (connectionId: string) => void;
  closeConnectionEditor: () => void;

  // Import/Export
  importCharacter: (character: Character) => void;
  exportCharacter: (id: string) => Character | null;
}

export type Store = AppState & AppActions;

// ===== ВСПОМОГАТЕЛЬНЫЕ ТИПЫ =====

export interface TreeNode {
  point: DespairPoint;
  connection?: Connection;
  children: TreeNode[];
}

export interface AxisConfig {
  name: keyof DespairVector;
  color: string;
  labels: {
    start: string;
    end: string;
  };
}
