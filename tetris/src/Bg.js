import * as THREE from 'three';
import vertex from './bg-vertex-shader.glsl';
import fragment from './bg-fragment-shader.glsl';
import { colors } from './constants';

export class Bg extends THREE.Object3D {
  constructor({ viewWidth, viewHeight, time }) {
    super();

    this.viewHeight = viewHeight;
    this.viewWidth = viewWidth;
    this.time = time;

    const geometry = new THREE.PlaneBufferGeometry(viewWidth, viewHeight, 6, 6);
    const boardBgColor = new THREE.Color('#1c2940');
    const boardBgColorDark = new THREE.Color('#060c10');
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uBoardBgColor: { value: boardBgColor },
        uBoardBgColorDark: { value: boardBgColorDark },
        uTime: {
          value: 0,
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      depthWrite: false,
      // wireframe: true,
    });

    this.allColors = [];
    this.allColors.push(new THREE.Color('#121929'));
    this.allColors.push(new THREE.Color('#1d293f'));
    this.allColors.push(new THREE.Color('#101A26'));
    this.allColors.push(new THREE.Color('#060B12'));
    this.allColors.push(new THREE.Color('#16263D'));
    this.allColors.push(new THREE.Color('#1B263A'));

    this.fromColors = [];
    this.toColors = [];

    for (let i = 0; i < geometry.attributes.position.count; i++) {
      const c =
        this.allColors[Math.floor(Math.random() * this.allColors.length)];
      const c2 =
        this.allColors[Math.floor(Math.random() * this.allColors.length)];
      this.fromColors.push(c);
      this.toColors.push(c2);
    }

    const colors = new Float32Array(geometry.attributes.position.count * 3);

    for (let i = 0; i < this.fromColors.length; i++) {
      const c = this.fromColors[i];
      this.setColor(colors, i, c);
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.planeMesh = new THREE.Mesh(geometry, this.material);
    this.add(this.planeMesh);
  }

  setColor = (colors, i, color) => {
    colors[3 * i] = color.r;
    colors[3 * i + 1] = color.g;
    colors[3 * i + 2] = color.b;
  };

  render = () => {
    this.material.uniforms.uTime.value = this.time.elapsed;
    const duration = 6;
    let playhead = (this.time.elapsed % duration) / duration;
    const colors = this.planeMesh.geometry.attributes.color.array;
    for (let i = 0; i < this.fromColors.length; i++) {
      const fromColor = this.fromColors[i];
      const toColor = this.toColors[i];
      const color = new THREE.Color();
      let playhead2 = Math.sin(Math.PI * 2 * playhead);
      playhead2 = (playhead2 + 1) / 2;

      if (playhead2 > 0.99) {
        if (!this.setFrom) {
          this.setFrom = true;
          for (let j = 0; j < this.fromColors.length; j++) {
            const c =
              this.allColors[Math.floor(Math.random() * this.allColors.length)];
            this.fromColors[j] = c;
          }
        }
      } else {
        this.setFrom = false;
      }

      if (playhead2 < 0.01) {
        if (!this.setTo) {
          this.setTo = true;
          for (let j = 0; j < this.toColors.length; j++) {
            const c =
              this.allColors[Math.floor(Math.random() * this.allColors.length)];
            this.toColors[j] = c;
          }
        }
      } else {
        this.setTo = false;
      }

      color.lerpColors(fromColor, toColor, playhead2);
      colors[3 * i] = color.r;
      colors[3 * i + 1] = color.g;
      colors[3 * i + 2] = color.b;
    }
    this.planeMesh.geometry.attributes.color.needsUpdate = true;
  };
}
