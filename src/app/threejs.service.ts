import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';

import * as THREE from 'three';
import { BoxGeometry, Mesh, MeshNormalMaterial, Object3DEventMap, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { MeshInterface } from './interfaces/mesh-interface';
import { CameraInterface } from './interfaces/camera-interface';

@Injectable({
  providedIn: 'root'
})
export class ThreejsService {

  width = 0;
  height = 0;
  camera: PerspectiveCamera = new THREE.PerspectiveCamera();
  cameraItem: CameraInterface = {
    fov: 70,
    aspect: 1,
    near: .01,
    far: 2000,
    xPos: 0,
    yPos: 0,
    zPos: 5
  };
  meshes: Mesh<BoxGeometry, MeshNormalMaterial, Object3DEventMap>[] = [];
  renderer: WebGLRenderer = new THREE.WebGLRenderer( { antialias: true } );
  scene: Scene = new THREE.Scene();
  meshItems: MeshInterface[] = [];

  private initialized: WritableSignal<boolean> = signal(false);
  isInitiazed: Signal<boolean> = computed( () => this.initialized() );

  private meshListSignal: WritableSignal<MeshInterface[]> = signal(this.meshItems);
  meshList: Signal<MeshInterface[]> = computed( () => this.meshListSignal() );

  private cameraItemSignal: WritableSignal<CameraInterface> = signal(this.cameraItem);
  cameraItemValues: Signal<CameraInterface> = computed( () => this.cameraItemSignal() );

  constructor() { }

  markAsInitialized(): void
  {
    this.initialized.set(true);
  }

  setDims(vizDiv: HTMLDivElement):void{
    this.width = vizDiv.clientWidth;
    this.height = vizDiv.clientHeight;

    this.cameraItem.aspect = this.width/this.height;
  }

  setupCamera(): void
  {
    this.camera = new THREE.PerspectiveCamera( 
      this.cameraItem.fov, 
      this.cameraItem.aspect, 
      this.cameraItem.near, 
      this.cameraItem.far);
      this.camera.position.z = this.cameraItem.zPos;
      this.camera.position.x = this.cameraItem.xPos;
      this.camera.position.y = this.cameraItem.yPos;
  }

  updateCamera(cameraItem: CameraInterface): void
  {
    console.log(cameraItem);

  }

  addMesh(meshItem: MeshInterface): MeshInterface
  {
    const geometry: BoxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material: MeshNormalMaterial = new THREE.MeshNormalMaterial();

    const mesh: Mesh<BoxGeometry, MeshNormalMaterial, Object3DEventMap> = new THREE.Mesh( geometry, material );
    meshItem.id = mesh.id;
    this.meshes.push(mesh);

    this.updateMesh(meshItem);    

    this.meshItems.push( meshItem );

    this.meshListSignal.set(this.meshItems);

    this.scene.add( mesh );

    return meshItem;
  }

  updateMesh(meshItem: MeshInterface): void
  {
    const updateMesh = this.meshes.find((mesh) => mesh.id === meshItem.id);

    updateMesh?.position.setX(meshItem.xPos);
    updateMesh?.position.setY(meshItem.yPos);
    updateMesh?.position.setZ(meshItem.zPos);
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