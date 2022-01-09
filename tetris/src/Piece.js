import * as THREE from 'three';
import { Box } from './Box';

const makeShape = (name, ...positions) => {
  return {
    name,
    positions,
  };
};

const shapes = [
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

const colors = [
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

export class Piece extends THREE.Object3D {
  constructor({ x, y, size, xOffset, yOffset, maxX, maxY }) {
    super();
    this.boxes = [];
    this.maxX = maxX;

    const shape = shapes[Math.floor(shapes.length * Math.random())];

    const color = colors[Math.floor(colors.length * Math.random())];

    for (const position of shape.positions) {
      const box = new Box({
        x: x + position.x,
        y: y + position.y,
        size,
        xOffset,
        yOffset,
        maxX,
        maxY,
        color,
      });
      this.boxes.push(box);
      this.add(box);
    }
  }

  moveDown = () => {
    if (!this.canMoveDown()) {
      return;
    }
    for (const box of this.boxes) {
      box.moveDown();
    }
  };

  canMoveDown = () => {
    const minY = Math.min.apply(
      Math,
      this.boxes.map((b) => b.y)
    );
    return minY > 0;
  };

  moveLeft = () => {
    if (!this.canMoveLeft()) {
      return;
    }
    for (const box of this.boxes) {
      box.moveLeft();
    }
  };

  canMoveLeft = () => {
    const minX = Math.min.apply(
      Math,
      this.boxes.map((b) => b.x)
    );
    return minX > 0;
  };

  moveRight = () => {
    if (!this.canMoveRight()) {
      return;
    }
    for (const box of this.boxes) {
      box.moveRight();
    }
  };

  canMoveRight = () => {
    const maxX = Math.max.apply(
      Math,
      this.boxes.map((b) => b.x)
    );
    return maxX < this.maxX;
  };
}
