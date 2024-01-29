import { Injectable } from '@angular/core';

import * as THREE from 'three';
import { BoxGeometry, Mesh, MeshNormalMaterial, Object3DEventMap, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

@Injectable({
  providedIn: 'root'
})
export class ThreejsService {

  constructor() { }

  runThreeJs(window: Window): void
  {
    const width = window.innerWidth, height = window.innerHeight;

// init

const camera: PerspectiveCamera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 10 );
camera.position.z = 5;

const scene: Scene = new THREE.Scene();

const geometry: BoxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
const material: MeshNormalMaterial = new THREE.MeshNormalMaterial();

const mesh: Mesh<BoxGeometry, MeshNormalMaterial, Object3DEventMap> = new THREE.Mesh( geometry, material );
scene.add( mesh );

const renderer: WebGLRenderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( width, height );
renderer.setAnimationLoop( animation );
document.body.appendChild( renderer.domElement );

// animation

function animation( time: number ) {

	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;

	renderer.render( scene, camera );

}
  }
  }

