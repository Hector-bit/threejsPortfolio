// import './css/style.css';
import * as THREE from 'three';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';
import { Material, QuadraticBezierCurve } from 'three';
// import * as myChair from './models/scene.gltf'; 

// DEBUG
const gui = new dat.GUI();
var settings = {
  playhead: 0.001,
  blockX: 0.5,
  blockY: 16,
  blockZ: 2
}

gui.add(settings, "playhead", 0.001, 1, 0.001);
gui.add(settings, "blockX", -50, 50, 1)
gui.add(settings, "blockY", -50, 50, 1)
gui.add(settings, "blockZ", -50, 50, 1)

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

// ROOM
const loader = new GLTFLoader();

loader.load('models/room.gltf', function(gltf){
  scene.add( gltf.scene );
}, undefined, function ( error ) {
  console.log( error );
});


//scene and lights
const pointLight = new THREE.PointLight(0xffffff)
const lightHelper = new THREE.PointLightHelper(pointLight)
scene.add(lightHelper)

const controls = new OrbitControls(camera, renderer.domElement);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);
pointLight.position.set(30,30,10)


//FAKE SCROLL / SCROLL PERCENT

//lerp stands for linear interpolation
function lerp(x, y, a){
  return (1-a) * x + a * y
}

function scalePercent(start, end){
  return (scrollPercent - start) / (end -start);
}

var animationScripts = [];

const mat = new THREE.MeshStandardMaterial({color: 'red'});
const geo = new THREE.BoxGeometry(1,1,1);
const target = new THREE.Mesh(geo, mat);
target.position.x = -1;
target.position.y = 16.75;
target.position.z = 2.25;
camera.position.set(0, 16.75, 2.25)
scene.add(target);

animationScripts.push({
  start: 0,
  end: 101,
  func: function (){
      camera.position.x = lerp(1, 30, scalePercent(0, 101))
      camera.lookAt(target.position)
  },
})



document.body.onscroll = function () {
  //calculate the current scroll progress as a percentage
  scrollPercent =
      ((document.documentElement.scrollTop || document.body.scrollTop) /
          ((document.documentElement.scrollHeight ||
              document.body.scrollHeight) -
              document.documentElement.clientHeight)) *
          100;
  document.getElementById('scrollProgress').innerText =
      'Scroll Progress : ' + scrollPercent.toFixed(2);
};



const bezier = new THREE.CubicBezierCurve3(
  new THREE.Vector3(-0.5, 0.55, 0),
  new THREE.Vector3(-0.5, 0.1, 0),
  new THREE.Vector3(-0.45, 0.1, 0),
  new THREE.Vector3(0, 0.1, 0)
);



function playScrollAnimations() {
  animationScripts.forEach((a) => {
    if (scrollPercent >= a.start && scrollPercent < a.end){
      a.func();
    }
  })
}
let scrollPercent = 0;
//animations
function animate() 
{
  requestAnimationFrame( animate )

  // someObject.rotation.x += 0.001;
  // someObject.rotation.y += 0.005;
  // someObject.rotation.z += 0.001;
  playScrollAnimations()

  // controls.update()
  const playhead = settings.playhead;
  // target.position.x = settings.blockX;
  // target.position.y = settings.blockY;
  // target.position.z = settings.blockZ;

  //update target
// target.position.x = (playhead) - 0.5;
  // camera.lookAt(target.position);
  // camera.position.x = settings.blockX + 5;
  // camera.position.y = settings.blockY;
  // camera.position.z = settings.blockZ;
  // const play_pos = bezier.getPoint(playhead);
  // camera.position.set(play_pos.x, play_pos.y, play_pos.z);
  console.log(target.position.z)
  renderer.render( scene, camera );
}

animate()

