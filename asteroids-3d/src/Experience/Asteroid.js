import * as THREE from 'three';
import CANNON from 'cannon';
import SimplexNoise from 'simplex-noise';
import { random } from './utils';

const simplex = new SimplexNoise();

export class Asteroid {
  constructor(experience, asteroidMaterial, location, velocity) {
    // general
    this.experience = experience;
    this.scene = experience.scene;
    this.config = this.experience.config;
    this.location = location;
    this.velocity = velocity;
    this.angleX = 0;
    this.angleY = 0;
    this.angleZ = 0;

    const { ASTEROID_MIN_HEALTH, ASTEROID_MAX_HEALTH } = this.experience.config;

    const speed = this.location
      .clone()
      .sub(this.location.clone().add(this.velocity))
      .length();

    this.aVelocityX = this.computeAngularVelocity(speed);
    this.aVelocityY = this.computeAngularVelocity(speed);
    this.aVelocityZ = this.computeAngularVelocity(speed);

    this.angleX = Math.random() * Math.PI;
    this.angleY = Math.random() * Math.PI;
    this.angleZ = Math.random() * Math.PI;

    this.isVisible = false;
    this.isOut = false;

    this.health = Math.round(random(ASTEROID_MIN_HEALTH, ASTEROID_MAX_HEALTH));

    // 3.js

    this.pWorld = experience.world.pWorld;

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

    // physics

    const sphereShape = new CANNON.Sphere(this.radius + this.displacementAmp);
    const sphereBody = new CANNON.Body({
      mass: this.radius ** 2,
      position: this.position,
      shape: sphereShape,
    });
    this.body = sphereBody;
    this.body.angularVelocity.set(
      this.aVelocityX,
      this.aVelocityY,
      this.aVelocityZ
    );
    this.body.userData = {
      type: 'asteroid',
    };

    this.mesh.position.set(this.location.x, this.location.y, 0);
    this.body.position.set(location.x, location.y, 0);

    // this.filmHeight = this.experience.camera.instance.getFilmHeight();
    // this.filmWidth = this.experience.camera.instance.getFilmWidth();
  }

  computeAngularVelocity(speed) {
    const { ASTEROID_MIN_SPEED, ASTEROID_MAX_SPEED } = this.experience.config;

    return speed
      ? THREE.MathUtils.mapLinear(
          speed,
          ASTEROID_MIN_SPEED,
          ASTEROID_MAX_SPEED,
          0.01,
          0.1
        )
      : 0;
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
    this.pWorld.addBody(this.body);
    this.scene.add(this.mesh);

    this.body.velocity.x = this.velocity.x;
    this.body.velocity.y = this.velocity.y;
  }

  randomizeGeometryPositions(asteroidGeometry) {
    const normals = asteroidGeometry.attributes.normal.array;
    const positions = asteroidGeometry.attributes.position.array;
    const uvs = asteroidGeometry.attributes.uv.array;

    let uvOffset = 0;
    const xFreq = 1 + Math.floor(Math.random() * 6);
    const yFreq = 1 + Math.floor(Math.random() * 6);
    this.displacementAmp = this.radius * (Math.random() * 0.4);
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
          simplex.noise2D(xNoise * xFreq, yNoise * yFreq) * this.displacementAmp
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
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);

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
      this.mesh.position.x < left * VIEWPORT_OFFSET_FACTOR ||
      this.mesh.position.x > right * VIEWPORT_OFFSET_FACTOR ||
      this.mesh.position.y > top * VIEWPORT_OFFSET_FACTOR ||
      this.mesh.position.y < bottom * VIEWPORT_OFFSET_FACTOR
    );
  }

  isDead() {
    return this.health <= 0;
  }

  destroy() {
    this.pWorld.removeBody(this.body);
    this.scene.remove(this.mesh);
    this.mesh.material.dispose();
    this.mesh.geometry.dispose();
  }
}
