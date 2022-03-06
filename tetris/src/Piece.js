import * as THREE from 'three';
import { Box } from './Box';
import { colors } from './constants';

export class Piece extends THREE.Object3D {
  constructor({ x, y, size, xOffset, yOffset, shape, color = null }) {
    super();
    this.boxes = [];
    this.shape = shape;

    this.color = color || colors[Math.floor(colors.length * Math.random())];

    for (const position of this.shape.positions) {
      const box = new Box({
        x: x + position.x,
        y: y + position.y,
        size,
        xOffset,
        yOffset,
        color: this.color,
      });
      this.boxes.push(box);
      this.add(box);
    }
  }

  get x() {
    return Math.min(...this.boxes.map((b) => b.x));
  }

  get y() {
    return Math.min(...this.boxes.map((b) => b.y));
  }

  get width() {
    return Math.max(...this.boxes.map((b) => b.x)) - this.x + 1;
  }

  get height() {
    return Math.max(...this.boxes.map((b) => b.y)) - this.y + 1;
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

  getNextSmallMovesDown = () => {
    const positions = [];
    for (const box of this.boxes) {
      positions.push(box.getNextSmallMoveDown());
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

  applyPositions2 = (positions) => {
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      const box = this.boxes[i];
      box.setPosition2(position.x, position.y);
    }
  };

  roundPositions = () => {
    for (const box of this.boxes) {
      box.roundPositions();
    }
  };

  applyPosition = (x, y) => {
    const animations = [];
    for (let i = 0; i < this.shape.positions.length; i++) {
      const position = this.shape.positions[i];
      const box = this.boxes[i];
      animations.push(box.setPosition(x + position.x, y + position.y));
    }
    return animations;
  };

  nextRotation = (xShift = 0) => {
    // helper grid
    const grid = new Array(4);
    for (let y = 0; y < 4; y++) {
      grid[y] = grid[y] || Array.from({ length: 4 }, () => null);
    }

    let [minX, maxY] = this.getMinXMaxY();
    minX = minX - xShift;

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
    let minX = Infinity;
    let maxY = -Infinity;
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

  getMaxDimension = () => {
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const position of this.shape.positions) {
      if (position.x > maxX) {
        maxX = position.x;
      }
      if (Math.abs(position.y) > maxY) {
        maxY = Math.abs(position.y);
      }
    }
    return Math.max(maxX + 1, maxY + 1);
  };

  dispose = () => {
    for (const box of this.boxes) {
      box.dispose();
    }
  };
}
