export type LayoutCell = {
  row: number;
  col: number;
  tag?: "entrance" | "stage" | "bar";
};

export type GeneratedLayout = {
  id: string;
  label: string;
  variant: "rectangle" | "l-shape" | "atrium";
  gridSize: number;
  cells: LayoutCell[];
  accents?: LayoutCell[];
  seed: string;
};

type LayoutShape = Omit<GeneratedLayout, "id" | "seed">;

const BASE_SHAPES: LayoutShape[] = [
  {
    label: "Atlas Rectangle",
    variant: "rectangle",
    gridSize: 6,
    cells: buildBlock([
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3],
      [2, 4],
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
    ]),
    accents: [
      { row: 4, col: 2, tag: "stage" },
      { row: 1, col: 2, tag: "bar" },
      { row: 2, col: 0, tag: "entrance" },
    ],
  },
  {
    label: "Obsidian L-Run",
    variant: "l-shape",
    gridSize: 6,
    cells: buildBlock([
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [5, 1],
      [5, 2],
      [5, 3],
      [4, 1],
      [4, 2],
      [4, 3],
      [3, 1],
      [3, 2],
      [2, 1],
      [1, 1],
    ]),
    accents: [
      { row: 5, col: 3, tag: "stage" },
      { row: 2, col: 0, tag: "entrance" },
      { row: 4, col: 1, tag: "bar" },
    ],
  },
  {
    label: "Halo Atrium",
    variant: "atrium",
    gridSize: 6,
    cells: buildBlock([
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 1],
      [1, 4],
      [2, 1],
      [2, 4],
      [3, 1],
      [3, 4],
      [4, 1],
      [4, 4],
      [5, 1],
      [5, 2],
      [5, 3],
      [5, 4],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
    ]),
    accents: [
      { row: 2, col: 1, tag: "bar" },
      { row: 3, col: 4, tag: "stage" },
      { row: 5, col: 2, tag: "entrance" },
    ],
  },
];

export function generateMockLayout(seed: string): GeneratedLayout {
  const normalized = seed.toLowerCase().replace(/\s+/g, "");
  const hash = [...normalized].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const shape = BASE_SHAPES[hash % BASE_SHAPES.length];

  return {
    ...shape,
    id: `${shape.variant}-${hash.toString(16)}`,
    seed,
    // Shuffle accents slightly so repeated addresses feel unique
    accents: shape.accents?.map((accent, index) => ({
      ...accent,
      row: clampIndex(accent.row + (((hash >> index) & 1) ? 0 : 1)),
      col: clampIndex(accent.col + (((hash >> (index + 2)) & 1) ? 0 : -1)),
    })),
  };
}

function buildBlock(points: Array<[number, number]>): LayoutCell[] {
  return points.map(([row, col]) => ({ row, col }));
}

function clampIndex(value: number): number {
  if (value < 0) return 0;
  if (value > 5) return 5;
  return value;
}
