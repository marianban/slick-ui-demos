import './style.css'
import * as THREE from 'three';

/* Based on shader template by Chris Johnson https://codepen.io/jhnsnc/pen/wWwprB */

var lastUpdate;
var container;
var camera, scene, renderer;
var uniforms;
var mesh;

function init() {
  // basic setup
  container = document.getElementById( 'container' );
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 20;
  scene = new THREE.Scene();
  const geometry = new THREE.CylinderBufferGeometry( 5, 5, 1, 100);

  // shader stuff
  uniforms = {
    u_time: { value: 1.0 },
    u_resolution: { value: new THREE.Vector2() }
  };
  var material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent
  } );
  lastUpdate = new Date().getTime();

  // put it together for rendering

  mesh = new THREE.Mesh( geometry, material );
  mesh.position.z = 0;
  mesh.rotation.order = 'YXZ';
  mesh.rotation.x = 3.14/2;

  scene.add( mesh );

  var vigneteGeometry = new THREE.PlaneBufferGeometry( 2, 2 );
  var vigneteMaterial = new THREE.ShaderMaterial( {
    transparent: true,
    vertexShader: document.getElementById( 'vertexShaderVignette' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShaderVignette' ).textContent
  } );
  var vignetteMesh = new THREE.Mesh( vigneteGeometry, vigneteMaterial );

  scene.add( vignetteMesh );

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setClearColor( 0x888888, 1);
  renderer.setPixelRatio( window.devicePixelRatio);
  container.appendChild( renderer.domElement );

  // event listeners
  onWindowResize();
  window.addEventListener( 'resize', onWindowResize, false);
  document.getElementById('resolution').addEventListener('change', onResolutionChange, false);
}

// events
function onWindowResize(evt) {
  renderer.setSize( window.innerWidth, window.innerHeight );
  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;
  renderer.setPixelRatio( window.innerWidth /  window.innerHeight);
  const aspect = window.innerWidth / window.innerHeight;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
}
function onResolutionChange(evt) {
  var newResolutionScale = parseFloat(evt.target.value);
  renderer.setPixelRatio( window.devicePixelRatio / newResolutionScale );
  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;
}
function animate() {
  var currentTime = new Date().getTime()
  var timeSinceLastUpdate = currentTime - lastUpdate;
  lastUpdate = currentTime;

  requestAnimationFrame( animate );
  render(timeSinceLastUpdate);
}
function render(timeDelta) {
  uniforms.u_time.value += (timeDelta ? timeDelta / 1000 : 0.05);

  if (mesh) {
    mesh.rotation.y += 0.0005 * timeDelta;
  }

  renderer.render( scene, camera );
}

// boot
init();
animate();
