// import './css/style.css';
import * as THREE from '/node_modules/three/build/three.module.js';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';
// import * as myChair from './models/scene.gltf'; 

// DEBUG
const gui = new dat.GUI();


// SCENE
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setX(20);
camera.position.setY(20);
renderer.render( scene, camera );

// OBJECTS

// CHAIR
const loader = new GLTFLoader();

loader.load('models/room.gltf', function(gltf){
  scene.add( gltf.scene );
}, undefined, function ( error ) {
  console.log( error );
});


// SPHERE
// const geometry = new THREE.SphereGeometry(10, 40, 18);
// const material = new THREE.MeshStandardMaterial( { color: 0xCC3333 });
// const marsTexture = new THREE.TextureLoader().load(marsSurface)
// const someObject = new THREE.Mesh(geometry, material);
// mars.position.x = -10
// scene.add(someObject)

//scene and lights
const pointLight = new THREE.PointLight(0xffffff)
const lightHelper = new THREE.PointLightHelper(pointLight)
scene.add(lightHelper)

const controls = new OrbitControls(camera, renderer.domElement);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);
pointLight.position.set(100,100,100)

// const spaceTexture = new THREE.TextureLoader().load(backgroundPicure);
// scene.background = spaceTexture


function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = t * -0.1;
  camera.position.x = t * -0.2;
  camera.position.y = t * -0.2;
}

document.body.onscroll = moveCamera

//animations
function animate() 
{
  requestAnimationFrame( animate )

  // someObject.rotation.x += 0.001;
  // someObject.rotation.y += 0.005;
  // someObject.rotation.z += 0.001;

  controls.update()

  renderer.render( scene, camera );
}

animate()

