import * as THREE from 'three';
import { shapes } from './constants';
import { Piece } from './Piece';

const randomShape = () => shapes[Math.floor(shapes.length * Math.random())];

export class ShapeQueue extends THREE.Object3D {
  constructor({ yOffset, boxSize, viewHeight, aspect, time }) {
    super();

    this.yOffset = yOffset;
    this.viewHeight = viewHeight;
    this.boxSize = boxSize;
    this.aspect = aspect;
    this.time = time;
    this.updatePosition(aspect);

    this.shapes = [randomShape(), randomShape(), randomShape()];
    this.pieces = [];
    this.pivots = [];
    this.rotationDirection = 1;

    let y = -2.5;
    for (let i = 0; i < this.shapes.length; i++) {
      const shape = this.shapes[i];
      const piece = new Piece({
        shape,
        size: this.boxSize,
        x: -5,
        y: y,
        xOffset: 0,
        yOffset: 0,
      });
      const halfWidth = (piece.width * this.boxSize) / 2;
      piece.position.x = piece.position.x - halfWidth;

      var pivot = new THREE.Group();
      pivot.add(piece);
      this.pivots.push(pivot);
      this.add(pivot);

      this.pieces.push(piece);

      y -= piece.height + 2;
    }
  }

  getNextShape = () => {
    this.shapes.push(randomShape());
    return this.shapes.shift();
  };

  updatePosition = (aspect) => {
    this.position.x = (this.viewHeight / 2) * aspect;
    this.position.y = -this.yOffset;
    console.log(this.viewHeight * aspect, this.boxSize);
  };

  render = () => {
    for (const pivot of this.pivots) {
      // const halfWidth = (piece.width * this.boxSize) / 2;
      // piece.applyMatrix4(new THREE.Matrix4().makeTranslation(halfWidth, 0, 0));
      pivot.rotation.x = (this.time.elapsed % 2) - 1;
    }
  };
}
