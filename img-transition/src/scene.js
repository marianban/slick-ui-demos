import * as THREE from 'three';
import { Pane } from 'tweakpane';
import { gsap } from 'gsap';
import { computeScale, mix } from './utils';
import { effects } from './effects';

const findEffect = (name) => {
  return effects.find((e) => e.name === name);
};

export class Scene {
  constructor(images) {
    this.images = images;
    this.imageIndex = 1;
    this.params = {
      progress: 0,
      effect: effects[2].name,
    };
    this.time = 0;
    this.lastTime = Date.now();

    this.initDebug();
    this.initScene();
    this.initEventListeners();
    this.render();
  }

  get devicePixelRatio() {
    return Math.min(window.devicePixelRatio, 2);
  }

  initEventListeners = () => {
    window.addEventListener('click', this.handleClick);
    window.addEventListener('touchend', this.handleClick);
    window.addEventListener('resize', this.handleResize);
  };

  initDebug = () => {
    const pane = new Pane();
    pane.addInput(this.params, 'progress', { min: 0, max: 1, step: 0.01 });
    pane
      .addInput(this.params, 'effect', {
        options: effects.reduce(
          (acc, effect) => ({
            ...acc,
            [effect.name]: effect.name,
          }),
          {}
        ),
      })
      .on('change', (event) => {
        this.mesh.material.dispose();
        this.mesh.material = this.createMaterial();
      });
  };

  initScene = () => {
    this.scene = new THREE.Scene();
    const cameraAspect = window.innerWidth / window.innerHeight;
    this.initialWidth = window.innerWidth;
    this.initialHeight = window.innerHeight;
    const halfHeight = window.innerHeight / 2;
    const fov = Math.atan(halfHeight / 600) * (360 / (Math.PI * 2)) * 2;
    this.camera = new THREE.PerspectiveCamera(fov, cameraAspect, 290, 1010);
    this.camera.position.z = 600;

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(this.devicePixelRatio);
    this.renderer.setClearColor('#111111');
    document.body.appendChild(this.renderer.domElement);

    this.texture1 = new THREE.Texture(this.images[this.imageIndex - 1]);
    this.texture1.needsUpdate = true;
    this.texture2 = new THREE.Texture(this.images[this.imageIndex]);
    this.texture2.needsUpdate = true;

    const geometry = new THREE.PlaneGeometry(
      window.innerWidth,
      window.innerHeight
    );

    this.mesh = new THREE.Mesh(geometry, this.createMaterial());

    this.scene.add(this.mesh);
  };

  createMaterial = () => {
    const selectedEffect = findEffect(this.params.effect);

    const uPixelSize = 1;
    const material = new THREE.ShaderMaterial({
      vertexShader: selectedEffect.vertex,
      fragmentShader: selectedEffect.fragment,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: this.devicePixelRatio },
        uTexture1: { value: this.texture1 },
        uTexture2: { value: this.texture2 },
        uProgress: { value: this.params.progress },
        uProgressMix: { value: this.params.progress },
        uAspectRatio: { value: 0 },
        uPixelSize: { value: uPixelSize },
        uScreenSize: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
      },
    });
    return material;
  };

  setScale = (progress) => {
    if (!this.texture1.source.data || !this.texture2.source.data) {
      return;
    }

    let textureWidth = mix(
      this.texture1.source.data.width,
      this.texture2.source.data.width,
      progress
    );
    let textureHeight = mix(
      this.texture1.source.data.height,
      this.texture2.source.data.height,
      progress
    );

    const { scaleX, scaleY } = computeScale({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      initialWindowWidth: this.initialWidth,
      initialWindowHeight: this.initialHeight,
      initialTextureWidth: textureWidth,
      initialTextureHeight: textureHeight,
    });

    this.mesh.scale.setX(scaleX);
    this.mesh.scale.setY(scaleY);
  };

  render = () => {
    const progress = Math.sin(Math.PI * this.params.progress);

    this.mesh.material.uniforms.uProgress.value = progress;
    this.mesh.material.uniforms.uProgressMix.value = this.params.progress;
    this.mesh.material.uniforms.uTime.value = this.time;

    const now = Date.now();
    const delta = (now - this.lastTime) / 1000;
    this.time += delta;

    this.setScale(this.params.progress);

    requestAnimationFrame(this.render);

    this.renderer.render(this.scene, this.camera);
    this.lastTime = now;
  };

  handleClick = (event) => {
    if (!(event.target instanceof HTMLCanvasElement)) {
      return;
    }

    this.imageIndex++;

    if (this.animation && this.animation.progress() < 1) {
      this.animation.progress(1).kill();
      this.imageIndex++;
    }

    this.animation = gsap.to(this.params, {
      progress: 1,
      ease: 'slow(0.7,0.7, false)',
      duration: 0.75,
      onComplete: () => {
        const prevTexture = new THREE.Texture(this.texture2.source.data);
        prevTexture.needsUpdate = true;
        this.texture1 = prevTexture;
        this.mesh.material.uniforms.uTexture1.value = this.texture1;

        const nextImage = this.images[this.imageIndex % this.images.length];
        const nextTexture = new THREE.Texture(nextImage);
        nextTexture.needsUpdate = true;
        this.texture2 = nextTexture;
        this.mesh.material.uniforms.uTexture2.value = nextTexture;
        this.params.progress = 0;
      },
    });
  };

  handleResize = () => {
    const cameraAspect = window.innerWidth / window.innerHeight;
    const halfHeight = window.innerHeight / 2;
    const fov = Math.atan(halfHeight / 600) * (360 / (Math.PI * 2)) * 2;
    this.camera.aspect = cameraAspect;
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(this.devicePixelRatio);
  };
}
