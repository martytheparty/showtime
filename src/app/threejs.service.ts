import { Injectable } from '@angular/core';

import * as THREE from 'three';
import { BoxGeometry, Mesh, MeshNormalMaterial, Object3DEventMap, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

@Injectable({
  providedIn: 'root'
})
export class ThreejsService {

  width = 0;
  height = 0;
  camera: PerspectiveCamera = new THREE.PerspectiveCamera();
  meshes: Mesh<BoxGeometry, MeshNormalMaterial, Object3DEventMap>[] = [];
  renderer: WebGLRenderer = new THREE.WebGLRenderer( { antialias: true } );

  constructor() { }

  runThreeJs(window: Window): void
  {

    const animation = ( time: number ) => {

      this.meshes.forEach(
        (mesh) => {
          mesh.rotation.x = time / 2000;
          mesh.rotation.y = time / 1000;
        }
      );
      this.renderer.render( scene, this.camera );
    
    }

    this.width = window.innerWidth
    this.height = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera( 70, this.width / this.height, 0.01, 10 );
    this.camera.position.z = 5;

    const scene: Scene = new THREE.Scene();

    const geometry: BoxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material: MeshNormalMaterial = new THREE.MeshNormalMaterial();

    const mesh: Mesh<BoxGeometry, MeshNormalMaterial, Object3DEventMap> = new THREE.Mesh( geometry, material );
    this.meshes.push(mesh);
    scene.add( this.meshes[0] );
    this.renderer.setSize( this.width, this.height );
    this.renderer.setAnimationLoop( animation );
    document.body.appendChild( this.renderer.domElement );
  }
}