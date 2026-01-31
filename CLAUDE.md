# Пространство Отчаяния

3D визуализатор философской модели отчаяния Сёрена Кьеркегора.

## Технологии

- React 19 + TypeScript + Vite
- Three.js + @react-three/fiber + @react-three/drei
- Zustand (state management с localStorage persistence)
- Tailwind CSS 4

## Запуск

```bash
npm install
npm run dev
```

## Структура

```
src/
├── types/          # TypeScript типы (DespairPoint, Character, etc.)
├── store/          # Zustand store с persistence
├── data/           # Описания, лейблы, пресеты
├── utils/          # Утилиты (цвета, граф, export)
├── components/
│   ├── Layout/     # MainLayout, Sidebar, DetailPanel
│   ├── Scene3D/    # 3D сцена, оси, точки, связи
│   ├── UI/         # Редакторы, списки, история
│   └── Modals/     # Модальные окна
```

## Ключевые концепции

### Пространство отчаяния (3 оси)
- **X: Конечное ↔ Бесконечное** — потеря себя в мире vs потеря мира в себе
- **Y: Необходимость ↔ Возможность** — детерминизм vs паралич выбора
- **Z: Неведение ↔ Осознанность** — глубина понимания своего состояния

### Стадии существования
- **Эстетическая** — жизнь моментом (sensual, romantic, intellectual, demonic)
- **Этическая** — жизнь долгом (bourgeois, heroic, ironic)
- **Религиозная** — жизнь перед Богом (religiousness_a, religiousness_b, demonic_religious)

### Персонаж
- **Ядро** — неизменное (история, тело, дар)
- **Точки** — состояния в пространстве отчаяния
- **Связи** — переходы (evolution, crisis, branch)

## Команды

```bash
npm run dev      # Запуск dev сервера
npm run build    # Production сборка
npm run preview  # Просмотр production сборки
```
