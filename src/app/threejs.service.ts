import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';

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
  scene: Scene = new THREE.Scene();

  private initialized: WritableSignal<boolean> = signal(false);
  isInitiazed: Signal<boolean> = computed( () => this.initialized() );

  constructor() { }

  markAsInitialized(): void
  {
    this.initialized.set(true);
  }

  setDims(vizDiv: HTMLDivElement):void{

    this.width = vizDiv.clientWidth;
    this.height = vizDiv.clientHeight;
  }

  setupCamera(): void
  {
    this.camera = new THREE.PerspectiveCamera( 70, this.width / this.height, 0.01, 10 );
    this.camera.position.z = 5;
  }

  addMesh(): void
  {
    const geometry: BoxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material: MeshNormalMaterial = new THREE.MeshNormalMaterial();

    const mesh: Mesh<BoxGeometry, MeshNormalMaterial, Object3DEventMap> = new THREE.Mesh( geometry, material );
    this.meshes.push(mesh);

    this.scene.add( this.meshes[0] );
  }

  setupRenderer(): void
  {
    this.renderer.setSize( this.width, this.height );
    this.renderer.setAnimationLoop( this.animationCallback() );
  }

  animationCallback(): XRFrameRequestCallback
  {
    const animation: XRFrameRequestCallback = ( time: number ) => {

      this.meshes.forEach(
        (mesh) => {
          mesh.rotation.x = time / 2000;
          mesh.rotation.y = time / 1000;
        }
      );
      this.renderer.render( this.scene, this.camera );
    }

    return animation;
  }

  attachDom(vizDiv: HTMLDivElement): void
  {
    vizDiv.appendChild( this.renderer.domElement );
  }
}