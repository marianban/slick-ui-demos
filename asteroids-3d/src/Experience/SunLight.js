import * as THREE from 'three';

export default class SunLight {
  constructor(experience) {
    this.experience = experience;
    this.camera = this.experience.camera;
    this.targetElement = this.experience.targetElement;
    this.debug = this.experience.debug;
    this.time = this.experience.time;
    this.scene = this.experience.scene;

    // Debug

    this.setLight();
  }

  setLight() {
    this.light = {};

    this.light.color = 0xffffff;
    this.light.intensity = 1;

    // Instance
    this.light.instance = new THREE.DirectionalLight(this.light.color);
    this.light.instance.position.set(1, 1, 0);
    this.scene.add(this.light.instance);
  }

  update() {
    // Light
    // this.light.instance.intensity = this.light.intensity + Math.sin(this.time.elapsed * 0.00004 * 100) * this.light.intensity * 0.5 - this.light.intensity * 0.5
    this.light.instance.intensity = this.light.intensity;
  }
}
