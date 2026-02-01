# Пространство Отчаяния

3D визуализатор философской модели отчаяния Сёрена Кьеркегора.

## Технологии

- React 19 + TypeScript + Vite 7
- Three.js + @react-three/fiber + @react-three/drei
- Zustand 5 (state management с localStorage persistence и миграциями)
- Tailwind CSS 4

## Запуск

```bash
npm install
npm run dev
```

## Структура

```
src/
├── types/index.ts      # TypeScript типы
├── store/useStore.ts   # Zustand store с persistence
├── data/
│   ├── descriptions.ts # Тексты описаний осей и стадий
│   ├── labels.ts       # Лейблы UI
│   └── presets.ts      # Пресеты персонажей
├── utils/
│   ├── colorUtils.ts   # Генерация цветов
│   ├── graphUtils.ts   # Работа с графом (buildTree, findPath)
│   └── exportUtils.ts  # Import/export JSON
├── components/
│   ├── Layout/
│   │   ├── MainLayout.tsx   # Основной layout
│   │   ├── Sidebar.tsx      # Боковая панель
│   │   └── DetailPanel.tsx  # Панель деталей
│   ├── Scene3D/
│   │   ├── DespairSpace.tsx      # Canvas + камера
│   │   ├── Axes.tsx              # 3D оси координат
│   │   ├── DespairPoint.tsx      # 3D точка (сфера)
│   │   ├── Connection.tsx        # Линия связи
│   │   └── CharacterTrajectory.tsx # Траектория персонажа
│   ├── UI/
│   │   ├── CharacterList.tsx   # Список персонажей
│   │   ├── CharacterCard.tsx   # Карточка персонажа
│   │   ├── CharacterEditor.tsx # Редактор персонажа
│   │   ├── PointEditor.tsx     # Редактор точки
│   │   ├── VectorSliders.tsx   # Слайдеры координат
│   │   ├── StageSelector.tsx   # Выбор стадии
│   │   └── HistoryView.tsx     # Просмотр истории
│   └── Modals/
│       ├── PointDetailModal.tsx # Детали точки
│       └── PathDetailModal.tsx  # Путь к точке
```

## Ключевые концепции

### Пространство отчаяния (3 оси, значения 0.0 - 1.0)

| Ось | 0.0 | 1.0 |
|-----|-----|-----|
| **finiteInfinite** | Конечное (потеря себя в мире) | Бесконечное (потеря мира в себе) |
| **necessityPossibility** | Необходимость (детерминизм) | Возможность (паралич выбора) |
| **consciousness** | Неведение | Полная осознанность |

### Подтипы осей

**Бесконечное** (finiteInfinite > 0.6):
- `imagination` — потерялся в фантазиях
- `cognition` — потерялся в познании
- `feeling` — абстрактные чувства
- `will` — грандиозные планы без действий

**Конечное** (finiteInfinite < 0.4):
- `conformist` — делает "как все"
- `prudent` — узкое благоразумие

**Возможность** (necessityPossibility > 0.6):
- `combinatorial` — комбинаторные фантазии
- `paralyzed` — паралич от возможностей

**Необходимость** (necessityPossibility < 0.4):
- `fatalist` — всё предопределено
- `determinist` — научный детерминизм

**Осознанность** (consciousness > 0.6):
- `suffering` — страдающее осознание
- `defiant` — дерзкое осознание

**Неведение** (consciousness < 0.4):
- `naive` — наивное неведение
- `busy` — занятость как бегство
- `denial` — активное отрицание

### Стадии существования

| Стадия | Описание | Подтипы |
|--------|----------|---------|
| **aesthetic** | Жизнь моментом | `sensual`, `romantic`, `intellectual` |
| **ethical** | Жизнь долгом | `civic`, `heroic` |
| **religious** | Жизнь перед Богом | `immanent`, `paradoxical` |

### Персонаж (Character)

```typescript
{
  id: string;
  name: string;
  color: string;              // цвет траектории
  core: {
    history: string[];        // ключевые события
    body?: string;            // физическое описание
    gift?: string;            // талант
  };
  points: DespairPoint[];     // состояния в пространстве
  connections: Connection[];  // переходы между точками
  rootPointId: string | null; // начальная точка
}
```

### Связи (Connection)

Типы переходов (`transitionType`):
- `evolution` — плавное развитие
- `crisis` — кризисный переход (с trigger и alternatives)
- `branch` — ответвление/альтернатива

## Store (Zustand)

```typescript
// Селекторы
useSelectedCharacter()  // текущий персонаж
useSelectedPoint()      // текущая точка
useCharacterById(id)    // персонаж по ID

// Ключевые actions
addCharacter(name, color?) → id
addPoint(characterId, point) → pointId
connectPoints(characterId, fromId, toId, type, crisis?)
importCharacter(character)
exportCharacter(id) → Character | null
```

Данные сохраняются в localStorage (`despair-space-storage`), версия 2.

## Команды

```bash
npm run dev      # Dev сервер (Vite)
npm run build    # Production сборка
npm run preview  # Просмотр production
npm run lint     # ESLint
```
