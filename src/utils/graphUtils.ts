import type { DespairPoint, Connection, TreeNode, Character } from '../types';

// Построить дерево из графа (от корня)
export const buildHistoryTree = (
  points: DespairPoint[],
  connections: Connection[],
  rootPointId: string | null
): TreeNode | null => {
  if (!rootPointId) return null;

  const pointsMap = new Map(points.map((p) => [p.id, p]));
  const visited = new Set<string>();

  const buildNode = (pointId: string, incomingConnection?: Connection): TreeNode | null => {
    if (visited.has(pointId)) return null;
    visited.add(pointId);

    const point = pointsMap.get(pointId);
    if (!point) return null;

    // Найти все исходящие связи
    const outgoingConnections = connections.filter((c) => c.fromPointId === pointId);

    // Рекурсивно построить детей
    const children: TreeNode[] = [];
    for (const conn of outgoingConnections) {
      const childNode = buildNode(conn.toPointId, conn);
      if (childNode) {
        children.push(childNode);
      }
    }

    return {
      point,
      connection: incomingConnection,
      children,
    };
  };

  return buildNode(rootPointId);
};

// Найти путь от корня до указанной точки
export const findPathFromRoot = (
  points: DespairPoint[],
  connections: Connection[],
  rootPointId: string | null,
  targetPointId: string
): DespairPoint[] => {
  if (!rootPointId) return [];

  const pointsMap = new Map(points.map((p) => [p.id, p]));
  const visited = new Set<string>();

  const findPath = (currentId: string, path: DespairPoint[]): DespairPoint[] | null => {
    if (visited.has(currentId)) return null;
    visited.add(currentId);

    const point = pointsMap.get(currentId);
    if (!point) return null;

    const newPath = [...path, point];

    if (currentId === targetPointId) {
      return newPath;
    }

    // Найти все исходящие связи
    const outgoingConnections = connections.filter((c) => c.fromPointId === currentId);

    for (const conn of outgoingConnections) {
      const result = findPath(conn.toPointId, newPath);
      if (result) return result;
    }

    return null;
  };

  return findPath(rootPointId, []) || [];
};

// Найти связь между двумя точками
export const findConnection = (
  connections: Connection[],
  fromId: string,
  toId: string | undefined
): Connection | undefined => {
  if (!toId) return undefined;
  return connections.find((c) => c.fromPointId === fromId && c.toPointId === toId);
};

// Преобразовать дерево в плоский список путей (для отображения всех веток)
export const treeToPathsList = (tree: TreeNode | null): DespairPoint[][] => {
  if (!tree) return [];

  const paths: DespairPoint[][] = [];

  const traverse = (node: TreeNode, currentPath: DespairPoint[]) => {
    const newPath = [...currentPath, node.point];

    if (node.children.length === 0) {
      paths.push(newPath);
    } else {
      for (const child of node.children) {
        traverse(child, newPath);
      }
    }
  };

  traverse(tree, []);
  return paths;
};

// Получить все точки с уровнем вложенности
export interface PointWithDepth {
  point: DespairPoint;
  depth: number;
  connection?: Connection;
  hasChildren: boolean;
  isLastChild: boolean;
}

export const flattenTreeWithDepth = (tree: TreeNode | null): PointWithDepth[] => {
  if (!tree) return [];

  const result: PointWithDepth[] = [];

  const traverse = (node: TreeNode, depth: number, isLastChild: boolean) => {
    result.push({
      point: node.point,
      depth,
      connection: node.connection,
      hasChildren: node.children.length > 0,
      isLastChild,
    });

    node.children.forEach((child, index) => {
      traverse(child, depth + 1, index === node.children.length - 1);
    });
  };

  traverse(tree, 0, true);
  return result;
};

// Скопировать историю до точки в текст
export const copyHistoryToPoint = (
  character: Character,
  targetPointId: string
): string => {
  const path = findPathFromRoot(
    character.points,
    character.connections,
    character.rootPointId,
    targetPointId
  );

  if (path.length === 0) return '';

  const translateStage = (stage: string) => {
    const map: Record<string, string> = {
      aesthetic: 'Эстетическая',
      ethical: 'Этическая',
      religious: 'Религиозная',
    };
    return map[stage] || stage;
  };

  let text = `# ${character.name}\n\n`;

  // Ядро
  text += `## Ядро\n`;
  if (character.core.history.length > 0) {
    text += character.core.history.map((h) => `- ${h}`).join('\n');
  }
  if (character.core.body) text += `\n- **Тело:** ${character.core.body}`;
  if (character.core.gift) text += `\n- **Дар:** ${character.core.gift}`;
  text += '\n\n';

  // Траектория
  text += `## Траектория\n\n`;
  path.forEach((point, i) => {
    text += `### ${point.momentName || `Момент ${i + 1}`}\n`;
    text += `**Стадия:** ${translateStage(point.stage)}`;
    if (point.stageSubtype) text += ` (${point.stageSubtype})`;
    text += '\n';
    text += `**Состояние:** ${point.label}\n\n`;
    text += `${point.description}\n\n`;

    // Если есть связь-кризис к следующей точке
    if (i < path.length - 1) {
      const connection = findConnection(
        character.connections,
        point.id,
        path[i + 1]?.id
      );
      if (connection?.crisis) {
        text += `> **Кризис:** ${connection.crisis.trigger}\n\n`;
      }
    }
  });

  return text;
};
