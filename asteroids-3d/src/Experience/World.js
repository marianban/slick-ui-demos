import * as THREE from 'three'
import SimplexNoise from 'simplex-noise';
import Experience from './Experience.js'
import AmbientLight from './AmbientLight.js';
import SunLight from './SunLight.js';

const simplex = new SimplexNoise();

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setLights();

        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setDummy()
            }
        })
    }

    setLights() {
        this.ambientLight = new AmbientLight(this.experience);
        this.sunLight = new SunLight(this.experience);
    }

    setDummy()
    {
        const segmentCount = 5;
        const sphereGeometry = new THREE.SphereGeometry(1, segmentCount, segmentCount);

        const normals = sphereGeometry.attributes.normal.array;
        const positions = sphereGeometry.attributes.position.array;
        const uvs = sphereGeometry.attributes.uv.array;
        let uvOffset = 0;
        const xFreq = 2;
        const yFreq = 3;
        const displacementAmp = 0.2;
        const xNoises = [];
        const yNoises = [];

        let prevPos = new THREE.Vector3();
        let posIndex = 0;
        for (let i = 0; i < positions.length; i+=3) {

            const x = i;
            const y = i + 1;
            const z = i + 2;

            const uvX = x - uvOffset;
            const uvY = y - uvOffset;

            const normal = new THREE.Vector3( normals[x], normals[y], normals[z]);

            const position = new THREE.Vector3(positions[x], positions[y], positions[z]);

            const xNoise = Math.abs(uvs[uvX] - 0.5);
            const yNoise = Math.abs(uvs[uvY] - 0.5);

            xNoises.push(xNoise);
            yNoises.push(yNoise);

            position.add(normal.multiplyScalar(simplex.noise2D(xNoise * xFreq, yNoise * yFreq) * displacementAmp ));

            positions[x] = position.x;
            positions[y] = position.y;
            positions[z] = position.z;

            uvOffset += 1;
        }

        const topVec = new THREE.Vector3(positions[0], positions[1], positions[2]);
        for (let i = 0; i < segmentCount * 3; i+=3) {
            const x = i;
            const y = i + 1;
            const z = i + 2;

            positions[x] = topVec.x;
            positions[y] = topVec.y;
            positions[z] = topVec.z;
        }



        sphereGeometry.computeVertexNormals();

        console.log(sphereGeometry.attributes.position.array)

        const cube = new THREE.Mesh(
            sphereGeometry,
            new THREE.MeshStandardMaterial({ map: this.resources.items.groundColor , aoMap: this.resources.items.groundAo, roughnessMap: this.resources.items.groundRoughness, displacementMap: this.resources.items.groundDisplacement, displacementScale: 0.2, normalMap: this.resources.items.groundNormal })
        )
        this.scene.add(cube)
    }

    resize()
    {
    }

    update()
    {
    }

    destroy()
    {
    }
}
