import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';

import * as THREE from 'three';
import { BoxGeometry, Mesh, MeshNormalMaterial, Object3DEventMap, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { MeshInterface } from './interfaces/mesh-interface';

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
  meshItems: MeshInterface[] = [];

  private initialized: WritableSignal<boolean> = signal(false);
  isInitiazed: Signal<boolean> = computed( () => this.initialized() );

  private meshListSignal: WritableSignal<MeshInterface[]> = signal(this.meshItems);
  melisList: Signal<MeshInterface[]> = computed( () => this.meshListSignal() );

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

  addMesh(xPosition = 0): void
  {
    const geometry: BoxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material: MeshNormalMaterial = new THREE.MeshNormalMaterial();

    const mesh: Mesh<BoxGeometry, MeshNormalMaterial, Object3DEventMap> = new THREE.Mesh( geometry, material );
    mesh.position.setX(xPosition);    

    this.meshes.push(mesh);

    this.meshItems.push( {id: mesh.id, xPos: xPosition} );

    this.meshListSignal.set(this.meshItems);

    this.scene.add( mesh );


  }

  deleteMesh(id: number): void
  {
    const mesh = this.meshes.find( (mesh) => mesh.id === id);

    if(mesh)
    {
      this.scene.remove(mesh);
      this.meshes = this.meshes.filter((mesh) => mesh.id !== id);

      this.meshItems = this.meshItems.filter((mesh) => mesh.id !== id);

      this.meshListSignal.set(this.meshItems);
    }

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