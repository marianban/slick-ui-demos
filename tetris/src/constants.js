const makeShape = (name, ...positions) => {
  return {
    name,
    positions,
  };
};

export const shapes = [
  makeShape(
    'O',
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 1, y: -1 }
  ),
  makeShape(
    'I',
    { x: 0, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: -2 },
    { x: 0, y: -3 }
  ),
  makeShape(
    'S',
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 2, y: 0 }
  ),
  makeShape(
    'Z',
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 2, y: -1 }
  ),
  makeShape(
    'L',
    { x: 0, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: -2 },
    { x: 1, y: -2 }
  ),
  makeShape(
    'L',
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 1, y: -2 },
    { x: 0, y: -2 }
  ),
  makeShape(
    'T',
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 2, y: 0 }
  ),
];

export const colors = [
  '#a6cee3',
  '#1f78b4',
  '#b2df8a',
  '#33a02c',
  '#fb9a99',
  '#e31a1c',
  '#fdbf6f',
  '#ff7f00',
  '#cab2d6',
  '#6a3d9a',
  '#ffff99',
  '#b15928',
];
