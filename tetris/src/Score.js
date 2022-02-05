import * as THREE from 'three';
import { Text } from 'troika-three-text';
import { Box } from './Box';
import fontUrl from './BebasNeue-Regular.ttf';

export class Score extends THREE.Object3D {
  constructor({ yOffset, xOffset, boxSize, viewHeight, aspect }) {
    super();
    this.score = 0;
    this.yOffset = yOffset;
    this.xOffset = xOffset;
    this.viewHeight = viewHeight;
    this.boxSize = boxSize;

    this.initBorders();

    this.text = new Text();
    this.text.font = `static/${fontUrl}`;
    this.text.fontSize = boxSize;
    this.text.position.z = 0;
    this.text.position.y = -this.boxSize - yOffset;
    this.text.color = new THREE.Color('#6b6b6b').convertSRGBToLinear();
    this.text.material.depthWrite = false;
    this.text.material.depthTest = false;
    this.updatePosition(aspect);
    this.updateText();

    this.text.sync();

    this.add(this.text);
  }

  initBorders() {
    for (let i = 0; i <= 4; i++) {
      const box = new Box({
        x: -7,
        y: -i - 1,
        size: this.boxSize,
        xOffset: this.xOffset,
        yOffset: -this.yOffset,
        color: '#010101',
      });
      this.add(box);

      const boxb = new Box({
        x: -6 + i,
        y: -5,
        size: this.boxSize,
        xOffset: this.xOffset,
        yOffset: -this.yOffset,
        color: '#010101',
      });
      this.add(boxb);
    }
  }

  updatePosition = (aspect) => {
    this.text.fontSize = this.boxSize;
    this.text.position.x = (-this.viewHeight / 2) * aspect + this.text.fontSize;
    this.text.position.x = this.xOffset - this.boxSize * 5;
    this.text.position.y = -this.text.fontSize * 0.8 - this.yOffset;
    this.text.sync();
  };

  updateText = () => {
    this.text.text = `SCORE\n${this.score.toString().padStart(5, '0')}`;
    this.text.sync();
  };

  updateScore = (points) => {
    this.score += points;
  };

  resetScore = () => {
    this.score = 0;
  };

  render = () => {
    this.updateText();
  };
}
