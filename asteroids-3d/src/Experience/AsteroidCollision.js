import * as THREE from 'three';
import vertexShader from './shaders/asteroid-collision/vertex.glsl';
import fragmentShader from './shaders/asteroid-collision/fragment.glsl';

export class AsteroidCollision {
  constructor(experience, target) {
    this.experience = experience;
    this.scene = experience.scene;
    this.config = experience.config;
    this.progress =
      this.experience.config.ASTEROID_COLLISION_ANIMATION_DURATION / 1000;
    this.prevElapsedTime = 0;
    this.done = false;

    this.position = new THREE.Vector3();
    this.position.copy(target);

    const particleCount = 1;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = iy + 1;

      positions[ix] = target.x;
      positions[iy] = target.y;
      positions[iz] = target.z;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    this.prevElapsedTime = this.experience.clock.getElapsedTime();

    const material = new THREE.ShaderMaterial({
      depthWrite: false,
      transparent: true,
      uniforms: {
        uPixelRatio: { value: this.experience.config.pixelRatio },
        uTexture: { value: this.experience.resources.items.asteroidCollision },
        uTime: { value: 0 },
        uProgress: { value: 0 },
      },
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Points(geometry, material);

    this.mesh = mesh;
  }

  addToScene() {
    this.scene.add(this.mesh);
  }

  update() {
    this.mesh.position.copy(this.position);
    const elapsedTime = this.experience.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.prevElapsedTime;
    this.progress -= deltaTime;

    this.mesh.material.uniforms.uTime.value = elapsedTime;
    this.mesh.material.uniforms.uProgress.value =
      this.progress /
      (this.experience.config.ASTEROID_COLLISION_ANIMATION_DURATION / 1000);

    this.prevElapsedTime = elapsedTime;

    if (this.progress < 0) {
      this.done = true;
      // this.progress =
      //   this.experience.config.ASTEROID_COLLISION_ANIMATION_DURATION / 1000;
    }
  }

  isDone() {
    return this.done;
  }

  destroy() {
    this.scene.remove(this.mesh);
    this.mesh.material.dispose();
    this.mesh.geometry.dispose();
  }
}
