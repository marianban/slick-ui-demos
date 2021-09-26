import * as THREE from 'three';
import SimplexNoise from 'simplex-noise';
import { random } from './utils';

const simplex = new SimplexNoise();

export class Asteroid {
  constructor(experience, asteroidMaterial, location, velocity) {
    // general
    this.experience = experience;
    this.config = this.experience.config;
    this.location = location;
    this.velocity = velocity;
    this.angleX = 0;
    this.angleY = 0;
    this.angleZ = 0;

    const {
      ASTEROID_MIN_SPEED,
      ASTEROID_MAX_SPEED,
      ASTEROID_MIN_HEALTH,
      ASTEROID_MAX_HEALTH,
    } = this.experience.config;

    const speed = this.location
      .clone()
      .sub(this.location.clone().add(this.velocity))
      .length();

    this.aVelocityX = speed
      ? THREE.MathUtils.mapLinear(
          speed,
          ASTEROID_MIN_SPEED,
          ASTEROID_MAX_SPEED,
          0.01,
          0.1
        )
      : 0;
    this.aVelocityY = speed
      ? THREE.MathUtils.mapLinear(
          speed,
          ASTEROID_MIN_SPEED,
          ASTEROID_MAX_SPEED,
          0.01,
          0.1
        )
      : 0;

    this.aVelocityZ = speed
      ? THREE.MathUtils.mapLinear(
          speed,
          ASTEROID_MIN_SPEED,
          ASTEROID_MAX_SPEED,
          0.01,
          0.1
        )
      : 0;

    this.isVisible = false;
    this.isOut = false;

    this.health = Math.round(random(ASTEROID_MIN_HEALTH, ASTEROID_MAX_HEALTH));

    // 3.js

    this.scene = experience.scene;

    const segmentCount = 300;
    this.radius = 30 + Math.random() * 100;
    const asteroidGeometry = new THREE.SphereGeometry(
      this.radius,
      segmentCount,
      segmentCount
    );

    const positions = this.randomizeGeometryPositions(asteroidGeometry);
    this.fixTopVertices(segmentCount, positions);
    this.fixBottomVertices(positions, segmentCount);

    asteroidGeometry.computeVertexNormals();

    // for uv map
    asteroidGeometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(asteroidGeometry.attributes.uv.array, 2)
    );

    this.mesh = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

    this.mesh.position.set(this.location.x, this.location.y, 0);

    // this.filmHeight = this.experience.camera.instance.getFilmHeight();
    // this.filmWidth = this.experience.camera.instance.getFilmWidth();
  }

  static CreateMaterial(experience) {
    const resources = experience.resources;
    const asteroidMaterial = new THREE.MeshStandardMaterial({
      map: resources.items.groundColor,
      aoMap: resources.items.groundAo,
      aoMapIntensity: 2,
      roughnessMap: resources.items.groundRoughness,
      normalMap: resources.items.groundNormal,
    });
    return asteroidMaterial;
  }

  addToScene() {
    this.scene.add(this.mesh);
  }

  randomizeGeometryPositions(asteroidGeometry) {
    const normals = asteroidGeometry.attributes.normal.array;
    const positions = asteroidGeometry.attributes.position.array;
    const uvs = asteroidGeometry.attributes.uv.array;

    let uvOffset = 0;
    const xFreq = 1 + Math.floor(Math.random() * 6);
    const yFreq = 1 + Math.floor(Math.random() * 6);
    const displacementAmp = this.radius * (Math.random() * 0.4);
    const xNoises = [];
    const yNoises = [];

    for (let i = 0; i < positions.length; i += 3) {
      const x = i;
      const y = i + 1;
      const z = i + 2;

      const uvX = x - uvOffset;
      const uvY = y - uvOffset;

      const normal = new THREE.Vector3(normals[x], normals[y], normals[z]);

      const position = new THREE.Vector3(
        positions[x],
        positions[y],
        positions[z]
      );

      const xNoise = Math.abs(uvs[uvX] - 0.5);
      const yNoise = Math.abs(uvs[uvY] - 0.5);

      xNoises.push(xNoise);
      yNoises.push(yNoise);

      position.add(
        normal.multiplyScalar(
          simplex.noise2D(xNoise * xFreq, yNoise * yFreq) * displacementAmp
        )
      );

      positions[x] = position.x;
      positions[y] = position.y;
      positions[z] = position.z;

      uvOffset += 1;
    }
    return positions;
  }

  fixBottomVertices(positions, segmentCount) {
    let lastVertexY = 1000;
    let lastVertexIndex = positions.length - 1;
    for (let i = 0; i < segmentCount * 3; i += 3) {
      const y = positions.length - (i + 2);
      if (positions[y] < lastVertexY) {
        lastVertexIndex = positions.length - (i + 1);
        lastVertexY = positions[y];
      }
    }

    const lastVertex = new THREE.Vector3(
      positions[lastVertexIndex - 2],
      positions[lastVertexIndex - 1],
      positions[lastVertexIndex]
    );

    for (let i = 0; i < segmentCount * 3; i += 3) {
      const z = positions.length - (i + 1);
      const y = positions.length - (i + 2);
      const x = positions.length - (i + 3);

      positions[x] = lastVertex.x;
      positions[y] = lastVertex.y;
      positions[z] = lastVertex.z;
    }
  }

  fixTopVertices(segmentCount, positions) {
    let firstVertexY = -1;
    let firstVertexIndex = 0;
    for (let i = 0; i < segmentCount * 3; i += 3) {
      const y = i + 1;
      if (positions[y] > firstVertexY) {
        firstVertexIndex = i;
        firstVertexY = positions[y];
      }
    }

    const firstVertex = new THREE.Vector3(
      positions[firstVertexIndex],
      positions[firstVertexIndex + 1],
      positions[firstVertexIndex + 2]
    );

    for (let i = 0; i < segmentCount * 3; i += 3) {
      const x = i;
      const y = i + 1;
      const z = i + 2;

      positions[x] = firstVertex.x;
      positions[y] = firstVertex.y;
      positions[z] = firstVertex.z;
    }
  }

  update() {
    this.angleX += this.aVelocityX;
    this.angleY += this.aVelocityY;
    this.angleZ += this.aVelocityZ;

    this.location.add(this.velocity);

    this.mesh.rotation.x = this.angleX;
    this.mesh.rotation.y = this.angleY;
    this.mesh.rotation.z = this.angleZ;

    this.mesh.position.x = this.location.x;
    this.mesh.position.y = this.location.y;

    this.updateOut();
  }

  updateOut() {
    if (!this.isVisible) {
      if (!this.isOutOfViewport()) {
        this.isVisible = true;
      }
      return;
    }
    if (this.isOutOfViewport()) {
      this.isOut = true;
    }
  }

  isOutOfViewport() {
    const { top, bottom, left, right } = this.experience.camera.viewport;
    const { VIEWPORT_OFFSET_FACTOR } = this.config;
    return (
      this.location.x < left * VIEWPORT_OFFSET_FACTOR ||
      this.location.x > right * VIEWPORT_OFFSET_FACTOR ||
      this.location.y > top * VIEWPORT_OFFSET_FACTOR ||
      this.location.y < bottom * VIEWPORT_OFFSET_FACTOR
    );
  }

  isDead() {
    return this.health <= 0;
  }

  destroy() {
    this.scene.remove(this.mesh);
  }
}
