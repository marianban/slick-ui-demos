import * as THREE from 'three';
import vertex from './bg-vertex-shader.glsl';
import fragment from './bg-fragment-shader.glsl';

// https://github.com/tromero/BayerMatrix
import bayer8tile4 from './bayer8tile4.png';
import bayer16tile16 from './bayer16tile16.png';
import bayer16 from './bayer16.png';
import bayer16tile2 from './bayer16tile2.png';

export class Bg extends THREE.Object3D {
  constructor({ viewWidth, viewHeight, time }) {
    super();

    this.viewHeight = viewHeight;
    this.viewWidth = viewWidth;
    this.time = time;

    const size = 7;
    this.size = size;
    const geometry = new THREE.PlaneBufferGeometry(
      viewWidth,
      viewHeight,
      size - 1,
      size - 1
    );
    const boardBgColor = new THREE.Color('#1c2940');
    const boardBgColorDark = new THREE.Color('#060c10');
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uBoardBgColor: { value: boardBgColor },
        uBoardBgColorDark: { value: boardBgColorDark },
        uTime: {
          value: 0,
        },
        uBayerTexture: {
          value: new THREE.TextureLoader().load(`static/${bayer16tile16}`),
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      depthWrite: false,
      precision: 'highp',
    });

    this.setRandomColors();
    this.fromColors = new Array(size * size);
    this.toColors = new Array(size * size);

    this.generateColors(this.fromColors, size);
    this.setMissingColors(this.fromColors, size);

    this.generateColors(this.toColors, size);
    this.setMissingColors(this.toColors, size);

    const colors = new Float32Array(geometry.attributes.position.count * 3);

    for (let i = 0; i < size * size; i++) {
      const c = this.fromColors[i];
      this.setColor(colors, i, c);
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.planeMesh = new THREE.Mesh(geometry, this.material);
    this.add(this.planeMesh);
  }

  setRandomColors = () => {
    this.allColors = [];
    // this.allColors.push(new THREE.Color('#121929'));
    // this.allColors.push(new THREE.Color('#1d293f'));
    // this.allColors.push(new THREE.Color('#101A26'));
    // this.allColors.push(new THREE.Color('#060B12'));
    // this.allColors.push(new THREE.Color('#16263D'));
    // this.allColors.push(new THREE.Color('#1B263A'));

    // this.allColors.push(new THREE.Color('#061E3E'));
    // this.allColors.push(new THREE.Color('#251E3E'));
    // this.allColors.push(new THREE.Color('#451E3E'));
    // this.allColors.push(new THREE.Color('#651E3E'));
    // // this.allColors.push(new THREE.Color('#851E3E'));
    // // this.allColors.push(new THREE.Color('#1B263A'));

    // this.allColors.push(new THREE.Color('#111625'));
    // this.allColors.push(new THREE.Color('#341931'));
    // this.allColors.push(new THREE.Color('#571B3C'));
    // this.allColors.push(new THREE.Color('#7A1E48'));

    this.allColors.push(new THREE.Color('#323E59'));
    this.allColors.push(new THREE.Color('#1D3444'));
    this.allColors.push(new THREE.Color('#213359'));
    this.allColors.push(new THREE.Color('#18193D'));
  };

  generateColors = (colors, size) => {
    for (let i = 0; i < size * size; i++) {
      const row = Math.floor(i / size);
      const col = i % size;
      if ((col + (row % 2)) % 2) {
        const c =
          this.allColors[Math.floor(Math.random() * this.allColors.length)];
        const c2 =
          this.allColors[Math.floor(Math.random() * this.allColors.length)];
        colors[i] = c;
      } else {
        colors[i] = null;
      }
    }
  };

  setMissingColors = (colors, size) => {
    for (let i = 0; i < size * size; i++) {
      const row = Math.floor(i / size);
      const col = i % size;

      const fc = colors[i];
      if (fc === null) {
        const [tx, ty] = [col, row - 1 < 0 ? row + 1 : row - 1];
        const tc = colors[ty * size + tx];

        if (tc === undefined || tc === null) {
          throw new Error(row + '_' + col);
        }

        const [bx, by] = [col, row + 1 >= size ? row - 1 : row + 1];
        const bc = colors[by * size + bx];

        if (bc === undefined || bc === null) {
          throw new Error(row + '_' + col);
        }

        const tbc = new THREE.Color();
        tbc.lerpColors(tc, bc, 0.5);

        const [lx, ly] = [col - 1 < 0 ? col + 1 : col - 1, row];
        const lc = colors[ly * size + lx];

        if (lc === undefined || lc === null) {
          throw new Error(row + '_' + col);
        }

        const [rx, ry] = [col + 1 >= size ? col - 1 : col + 1, row];
        const rc = colors[ry * size + rx];

        if (rc === undefined || rc === null) {
          throw new Error(row + '_' + col);
        }

        const lrc = new THREE.Color();
        lrc.lerpColors(lc, rc, 0.5);

        const c = new THREE.Color();
        c.lerpColors(tbc, lrc, 0.5);

        colors[row * size + col] = c;
      }
    }
  };

  setColor = (colors, i, color) => {
    colors[3 * i] = color.r;
    colors[3 * i + 1] = color.g;
    colors[3 * i + 2] = color.b;
  };

  render = () => {
    this.material.uniforms.uTime.value = this.time.elapsed;
    const duration = 9;
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
          this.generateColors(this.fromColors, this.size);
          this.setMissingColors(this.fromColors, this.size);
        }
      } else {
        this.setFrom = false;
      }

      if (playhead2 < 0.01) {
        if (!this.setTo) {
          this.setTo = true;
          this.generateColors(this.toColors, this.size);
          this.setMissingColors(this.toColors, this.size);
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
