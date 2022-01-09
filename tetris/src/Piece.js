import * as THREE from 'three';
import { Box } from './Box';
import { shapes, colors } from './constants';

export class Piece extends THREE.Object3D {
  constructor({ x, y, size, xOffset, yOffset, maxX, maxY }) {
    super();
    this.x = x;
    this.y = y;
    this.boxes = [];
    this.maxX = maxX;

    let shape = shapes[Math.floor(shapes.length * Math.random())];
    shape = shapes.find((s) => s.name === 'T');

    const color = colors[Math.floor(colors.length * Math.random())];

    for (const position of shape.positions) {
      const box = new Box({
        x: x + position.x,
        y: y + position.y,
        _x: position.x,
        _y: position.y,
        size,
        xOffset,
        yOffset,
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
    this.y--;
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
    this.x--;
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
    this.x++;
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

  rotateRight = () => {
    // helper grid
    const grid = new Array(4);
    for (let y = 0; y < 4; y++) {
      grid[y] = grid[y] || Array.from({ length: 4 }, () => null);
    }

    for (const box of this.boxes) {
      grid[Math.abs(box._y)][box._x] = box;
    }

    // grid rotation
    const rotatedGrid = new Array(4);
    for (let y = 0; y < 4; y++) {
      rotatedGrid[y] = rotatedGrid[y] || Array.from({ length: 4 }, () => null);
      for (let x = 0; x < 4; x++) {
        rotatedGrid[y][x] = grid[3 - x][y];
      }
    }

    // compute offsets for top left alignment
    let yOffset = 0;
    loop1: for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (rotatedGrid[y][x] !== null) {
          yOffset = y;
          break loop1;
        }
      }
    }

    let xOffset = 0;
    loop2: for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (rotatedGrid[y][x] !== null) {
          xOffset = x;
          break loop2;
        }
      }
    }

    // update boxes
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (rotatedGrid[y][x] !== null) {
          const box = rotatedGrid[y][x];
          box.setPosition(
            this.x + x - xOffset,
            this.y + yOffset - y,
            x - xOffset,
            yOffset - y
          );
        }
      }
    }
  };
}
