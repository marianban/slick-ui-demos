import * as THREE from 'three';
import Experience from './Experience.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const CAMERA_DISTANCE = 3000;
const CAMERA_FOW = 25;

export default class Camera {
  constructor(_options) {
    // Options
    this.experience = new Experience();
    this.config = this.experience.config;
    this.debug = this.experience.debug;
    this.time = this.experience.time;
    this.sizes = this.experience.sizes;
    this.targetElement = this.experience.targetElement;
    this.scene = this.experience.scene;

    // Set up
    this.mode = 'debug'; // defaultCamera \ debugCamera

    this.setInstance();
    this.setModes();
    this.setViewport();
  }

  setInstance() {
    // Set up
    const aspect = this.config.width / this.config.height;
    this.instance = new THREE.PerspectiveCamera(CAMERA_FOW, aspect, 100, 10000);
    this.instance.rotation.reorder('YXZ');
    this.scene.add(this.instance);
  }

  setModes() {
    this.modes = {};

    // Default
    this.modes.default = {};
    this.modes.default.instance = this.instance.clone();
    this.modes.default.instance.rotation.reorder('YXZ');

    // Debug
    this.modes.debug = {};
    this.modes.debug.instance = this.instance.clone();
    this.modes.debug.instance.rotation.reorder('YXZ');
    this.modes.debug.instance.position.set(0, 0, 3000);

    this.modes.debug.orbitControls = new OrbitControls(
      this.modes.debug.instance,
      this.targetElement
    );
    this.modes.debug.orbitControls.enabled = this.modes.debug.active;
    this.modes.debug.orbitControls.screenSpacePanning = true;
    this.modes.debug.orbitControls.enableKeys = false;
    this.modes.debug.orbitControls.zoomSpeed = 0.25;
    this.modes.debug.orbitControls.enableDamping = true;
    this.modes.debug.orbitControls.update();
  }

  resize() {
    this.instance.aspect = this.config.width / this.config.height;
    this.instance.updateProjectionMatrix();

    this.modes.default.instance.aspect = this.config.width / this.config.height;
    this.modes.default.instance.updateProjectionMatrix();

    this.modes.debug.instance.aspect = this.config.width / this.config.height;
    this.modes.debug.instance.updateProjectionMatrix();
    this.setViewport();
  }

  setViewport() {
    const aspect = this.config.width / this.config.height;
    const degToRadRatio = 360 / (Math.PI * 2);
    const tanA = Math.tan(CAMERA_FOW / 2 / degToRadRatio);
    const adjacent = CAMERA_DISTANCE;
    const opposite = adjacent * tanA;

    this.viewport = {};
    this.viewport.top = opposite;
    this.viewport.bottom = -opposite;
    this.viewport.left = -opposite * aspect;
    this.viewport.right = opposite * aspect;
  }

  update() {
    // Update debug orbit controls
    this.modes.debug.orbitControls.update();

    // Apply coordinates
    this.instance.position.copy(this.modes[this.mode].instance.position);
    this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion);
    this.instance.updateMatrixWorld(); // To be used in projection
  }

  destroy() {
    this.modes.debug.orbitControls.destroy();
  }
}
