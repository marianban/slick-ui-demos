import * as THREE from 'three';
import { Text } from 'troika-three-text';
import fontUrl from './BebasNeue-Regular.ttf';

export class Score extends THREE.Object3D {
  constructor({ xOffset, yOffset, boxSize, viewHeight, aspect }) {
    super();
    this.score = 0;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.viewHeight = viewHeight;
    this.boxSize = boxSize;

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

  updatePosition = (aspect) => {
    this.text.fontSize = this.boxSize * aspect;
    this.text.position.x = (-this.viewHeight / 2) * aspect + this.text.fontSize;
    this.text.position.y = -this.text.fontSize - this.yOffset;
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
