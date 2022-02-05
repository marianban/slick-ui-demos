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
    this.pivots2 = [];
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

      piece.position.x = -halfWidth;

      this.pieces.push(piece);

      const pivot = new THREE.Group();

      pivot.position.x =
        this.boxSize * (3 - piece.width + piece.width) + this.boxSize * 2.5;

      pivot.add(piece);
      this.pivots.push(pivot);

      const pivot2 = new THREE.Group();
      pivot2.add(pivot);
      this.pivots2.push(pivot2);

      this.add(pivot2);

      y -= piece.height + 2;
    }
  }

  getNextShape = () => {
    this.shapes.push(randomShape());
    return this.shapes.shift();
  };

  updatePosition = (aspect) => {
    this.position.x = (this.viewHeight / 2) * aspect - this.boxSize * 10;
    this.position.y = -this.yOffset;
    console.log(this.viewHeight * aspect, this.boxSize);
  };

  render = () => {
    for (let i = 0; i < this.pivots.length; i++) {
      const pivot2 = this.pivots2[i];

      const duration = 10;
      let progress = ((i * 0.5 + this.time.elapsed) % duration) / duration;
      // progress = Math.sin(progress * Math.PI * 2);
      pivot2.rotation.y = progress * Math.PI * 2;
    }
  };
}
