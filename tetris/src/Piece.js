import * as THREE from 'three';
import { Box } from './Box';
import { colors } from './constants';

export class Piece extends THREE.Object3D {
  constructor({ x, y, size, xOffset, yOffset, shape }) {
    super();
    this.boxes = [];

    const color = colors[Math.floor(colors.length * Math.random())];

    for (const position of shape.positions) {
      const box = new Box({
        x: x + position.x,
        y: y + position.y,
        size,
        xOffset,
        yOffset,
        color,
      });
      this.boxes.push(box);
      this.add(box);
    }
  }

  nextMoveDown = () => {
    const positions = [];
    for (const box of this.boxes) {
      const position = box.nextMoveDown();
      positions.push(position);
    }
    return positions;
  };

  nextMoveLeft = () => {
    const positions = [];
    for (const box of this.boxes) {
      const position = box.nextMoveLeft();
      positions.push(position);
    }
    return positions;
  };

  nextMoveRight = () => {
    const positions = [];
    for (const box of this.boxes) {
      const position = box.nextMoveRight();
      positions.push(position);
    }
    return positions;
  };

  applyPositions = (positions) => {
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      const box = this.boxes[i];
      box.setPosition(position.x, position.y);
    }
  };

  nextRotation = () => {
    // helper grid
    const grid = new Array(4);
    for (let y = 0; y < 4; y++) {
      grid[y] = grid[y] || Array.from({ length: 4 }, () => null);
    }

    const [minX, maxY] = this.getMinXMaxY();

    for (const box of this.boxes) {
      // grid[Math.abs(box._y)][box._x] = box;
      grid[Math.abs(box.y - maxY)][box.x - minX] = box;
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

    // compute next positions
    const positions = new Array(this.boxes.length);

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (rotatedGrid[y][x] !== null) {
          const boxIndex = this.boxes.findIndex(
            (box) => box === rotatedGrid[y][x]
          );
          positions[boxIndex] = {
            x: minX + x - xOffset,
            y: maxY + yOffset - y,
          };
        }
      }
    }

    return positions;
  };

  getMinXMaxY = () => {
    let minX = Number.MAX_VALUE;
    let maxY = Number.MIN_VALUE;
    for (const box of this.boxes) {
      if (box.x < minX) {
        minX = box.x;
      }
      if (maxY < box.y) {
        maxY = box.y;
      }
    }
    return [minX, maxY];
  };
}
