// import './css/style.css';
import * as THREE from 'three';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';
// import * as myChair from './models/scene.gltf'; 
import { RectAreaLightUniformsLib } from './extra/RectAreaLightUniformLib';

RectAreaLightUniformsLib.init();

// DEBUG
const gui = new dat.GUI();
var settings = {
  playhead: 0.001,
  blockX: 0.5,
  blockY: 16,
  blockZ: 2,
  alight: 0.5,
}

gui.add(settings, "playhead", 0.001, 1, 0.001);
gui.add(settings, "blockX", -50, 50, 1)
gui.add(settings, "blockY", -50, 50, 1)
gui.add(settings, "blockZ", -50, 50, 1)
gui.add(settings, 'alight', 0.01, 1, 0.01)

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

//Rect light for computer screen youtube vid aat 2:35 https://www.youtube.com/watch?v=T6PhV4Hz0u4
//if i need help


// SCENE AND LIGHTS
var width = 5;
var height = 5;
var rectLight = new THREE.RectAreaLight( 0xffffff, 2,  width, height );
var pinkRectLight = new THREE.RectAreaLight( 0xFFC0CB, 1, 35, 35);
var greenRectLight = new THREE.RectAreaLight( 0x00FF00, 1, 30, 30);
rectLight.position.set( -1, 16.75, 2.25);
pinkRectLight.position.set(-1,  16.75, -35);
greenRectLight.position.set(-1,  16.75, 45);
rectLight.lookAt( 30,16.75,2.25 );
pinkRectLight.lookAt( 0.5, 16, 2);
greenRectLight.lookAt( 0.5, 16, 2);
// var rectLightHelper = new THREE.RectAreaLightHelper(rectLight );
// scene.add( rectLightHelper );
scene.add( rectLight, pinkRectLight, greenRectLight);
const pointLight = new THREE.PointLight(0x2c3f47, 1)
const lightHelper = new THREE.PointLightHelper(pointLight)
scene.add(lightHelper)

const controls = new OrbitControls(camera, renderer.domElement);
// const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, );
pointLight.position.set(25,25,10)


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
  playScrollAnimations()

  const playhead = settings.playhead;
  rectLight.position.x = settings.blockX;
  rectLight.position.y = settings.blockY;
  rectLight.position.z = settings.blockZ;

  //update target
// target.position.x = (playhead) - 0.5;
  // camera.position.set(play_pos.x, play_pos.y, play_pos.z);
  // ambientLight = new THREE.AmbientLight(0xffffff , settings.alight);
  // console.log(target.position.z)
  renderer.render( scene, camera );
}


window.scrollTo({ top: 0, behavior: 'smooth' })
animate()

