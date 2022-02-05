import * as THREE from 'three';
import { Text } from 'troika-three-text';
import fontUrl from './BebasNeue-Regular.ttf';
import { Box } from './Box';
import { shapes } from './constants';
import { Piece } from './Piece';

const randomShape = () => shapes[Math.floor(shapes.length * Math.random())];

export class ShapeQueue extends THREE.Object3D {
  constructor({
    yOffset,
    xOffset,
    boxSize,
    viewHeight,
    aspect,
    time,
    cols,
    rows,
  }) {
    super();

    this.yOffset = yOffset;
    this.xOffset = xOffset;
    this.viewHeight = viewHeight;
    this.boxSize = boxSize;
    this.aspect = aspect;
    this.time = time;
    this.cols = cols;
    this.rows = rows;

    this.initText();
    this.initBorders();

    this.updatePosition(aspect);

    this.shapes = [randomShape(), randomShape(), randomShape()];
    this.pieces = [];
    this.pivots = [];
    this.pivots2 = [];
    this.rotationDirection = 1;

    let y = -4;
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

  initText() {
    this.text = new Text();
    this.text.font = `static/${fontUrl}`;
    this.text.fontSize = this.boxSize;
    this.text.position.z = 0;
    this.text.color = new THREE.Color('#6b6b6b').convertSRGBToLinear();
    this.text.material.depthWrite = false;
    this.text.material.depthTest = false;
    this.text.fontSize = this.boxSize;
    this.text.position.x = -this.boxSize;
    this.text.position.y = -this.text.fontSize * 0.8;
    this.text.text = 'Next';
    this.add(this.text);
    this.text.sync();
  }

  initBorders() {
    for (let i = 0; i <= this.rows; i++) {
      const box = new Box({
        x: 8,
        y: -i - 1,
        size: this.boxSize,
        xOffset: this.xOffset,
        yOffset: 0,
        color: '#010101',
      });
      this.add(box);
    }
  }

  getNextShape = () => {
    this.shapes.push(randomShape());
    return this.shapes.shift();
  };

  updatePosition = (aspect) => {
    this.position.x = (this.viewHeight / 2) * aspect;
    this.position.x = this.xOffset + (this.cols + 4) * this.boxSize;
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
