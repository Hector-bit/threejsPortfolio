// import './css/style.css';
import * as THREE from 'three';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';
// import * as myChair from './models/scene.gltf'; 
import { RectAreaLightUniformsLib } from './extra/RectAreaLightUniformLib';
import { seededRandom } from 'three/src/math/MathUtils';
import { RectAreaLight } from 'three';

RectAreaLightUniformsLib.init();

// DEBUG
const gui = new dat.GUI();
var settings = {
  playhead: 0.001,
  blockX: 40,
  blockY: 40,
  blockZ: -22,
  greenx: 24,
  greeny: 26,
  greenz: 24,
  targetx: 10,
  targety: 18,
  targetz: 2.5,
  windowx: 10,
  windowy: 10,
  windowz: -28,
  windowBright: 1,
  greenBright: 1,
  pinkBright: 1
}

gui.add(settings, "playhead", 0.001, 1, 0.001)
gui.add(settings, "blockX", -80, 80, 1)
gui.add(settings, "blockY", -80, 80, 1)
gui.add(settings, "blockZ", -80, 80, 1)
gui.add(settings, "greenx", -80, 80, 1)
gui.add(settings, "greeny", -80, 80, 1)
gui.add(settings, "greenz", -80, 80, 1)
gui.add(settings, "targetx", -80, 80, 1)
gui.add(settings, "targety", -80, 80, 1)
gui.add(settings, "targetz", -80, 80, 1)
gui.add(settings, "windowx", -80, 80, 1)
gui.add(settings, "windowy", -80, 80, 1)
gui.add(settings, "windowz", -80, 80, 1)
gui.add(settings, "windowBright", 0, 100, 1)
gui.add(settings, "greenBright", 0, 100, 1)
gui.add(settings, "pinkBright", 0, 100, 1)


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

// ROOM
const loader = new GLTFLoader();

loader.load('models/room.gltf', function(gltf){
  scene.add( gltf.scene );
}, undefined, function ( error ) {
  console.log( error );
});

// OBJECTS
const mat = new THREE.MeshStandardMaterial({color: 'red'});
const geo = new THREE.BoxGeometry(1,1,1);
const target = new THREE.Mesh(geo, mat);
const rectLightTarget = new THREE.Mesh(geo, mat);
target.position.set(-1, 16.75, 2.25);
camera.position.set(0, 16.75, 2.25)
scene.add(target, rectLightTarget);

// SCENE AND LIGHTS
var rectLight = new THREE.RectAreaLight( 0xffffff, 2,  5, 5 );
var windowLight = new THREE.RectAreaLight( 0xffffff, settings.windowBright, 25, 25);
var greenRectLight = new THREE.RectAreaLight( 0x00FF00, settings.greenBright, 35, 35);
var pinkRectLight = new THREE.RectAreaLight( 0xFFC0CB, settings.pinkBright, 30, 30);

// LIGHT HELPERS
// const helper_windowLight = new RectAreaLightHelper( windowLight );
// windowLight.add( helper_windowLight );
const plane = new THREE.Plane( new THREE.Vector3( 10, 10, 20 ), 0 );
const helper = new THREE.PlaneHelper( plane, 10, 0xffff00 );
scene.add( helper );

rectLight.position.set( -1, 16.75, 2.25);
rectLight.lookAt( 30, 16.75, 2.25 );
windowLight.lookAt( 15, 15, 450 );

scene.add( rectLight, pinkRectLight, greenRectLight, windowLight );


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
  pinkRectLight.position.x = settings.blockX;
  pinkRectLight.position.y = settings.blockY;
  pinkRectLight.position.z = settings.blockZ;
  pinkRectLight.lookAt(rectLightTarget.position);

  greenRectLight.position.x = settings.greenx;
  greenRectLight.position.y = settings.greeny;
  greenRectLight.position.z = settings.greenz;
  greenRectLight.lookAt(rectLightTarget.position);

  rectLightTarget.position.x = settings.targetx;
  rectLightTarget.position.y = settings.targety;
  rectLightTarget.position.z = settings.targetz;

  windowLight.position.x = settings.windowx;
  windowLight.position.y = settings.windowy;
  windowLight.position.z = settings.windowz;

  // BRIGHTNESS
  pinkRectLight.intensity = settings.pinkBright; 
  greenRectLight.intensity = settings.greenBright;
  windowLight.intensity = settings.windowBright;
  // windowLight.position.set(-1,  16.75, -35);

  renderer.render( scene, camera );
}


window.scrollTo({ top: 0, behavior: 'smooth' })
animate()

