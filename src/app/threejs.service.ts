import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';

import * as THREE from 'three';
import { BoxGeometry, Mesh, MeshNormalMaterial, Object3DEventMap, OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { MeshInterface } from './interfaces/mesh-interface';
import { PerspectiveCameraInterface, OrthographicCameraInterface, CameraType } from './interfaces/camera-interfaces';
import { LightInterface } from './interfaces/light-interface';

@Injectable({
  providedIn: 'root'
})
export class ThreejsService {

  cameraType: CameraType = 'perspective';
  width = 0;
  height = 0;
  orthographicCamera: OrthographicCamera = new THREE.OrthographicCamera();
  orthographicCameraItem: OrthographicCameraInterface = {
    left: -6,
    right: 6,
    top: 5,
    bottom: -5,
    near: .01,
    far: 2000,
    xPos: 0,
    yPos: 0,
    zPos: 5
  };
  camera: PerspectiveCamera | OrthographicCamera = new THREE.PerspectiveCamera();
  cameraItem: PerspectiveCameraInterface = {
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
  lightItems: LightInterface[] = [];

  private initialized: WritableSignal<boolean> = signal(false);
  isInitiazed: Signal<boolean> = computed( () => this.initialized() );

  private meshListSignal: WritableSignal<MeshInterface[]> = signal(this.meshItems);
  meshList: Signal<MeshInterface[]> = computed( () => this.meshListSignal() );

  private lightListSignal: WritableSignal<LightInterface[]> = signal(this.lightItems);
  lightListValues: Signal<LightInterface[]> = computed( () => this.lightListSignal() );

  private cameraItemSignal: WritableSignal<PerspectiveCameraInterface> = signal(this.cameraItem);
  cameraItemValues: Signal<PerspectiveCameraInterface> = computed( () => this.cameraItemSignal() );

  private orthographicCameraItemSignal: WritableSignal<OrthographicCameraInterface> = signal(this.orthographicCameraItem);
  orthographicCameraItemValues: Signal<OrthographicCameraInterface> = computed( () => this.orthographicCameraItemSignal() );

  private animationSignal: WritableSignal<boolean> = signal(true);
  animationValue: Signal<boolean> = computed( () => this.animationSignal());

  constructor() { }

  updateAnimation(animationState: boolean): void
  {
    this.animationSignal.set(animationState);
  }

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
    if (this.cameraType === 'perspective')
    {
      this.camera = new THREE.PerspectiveCamera( 
        this.cameraItem.fov, 
        this.cameraItem.aspect, 
        this.cameraItem.near, 
        this.cameraItem.far);
        this.camera.position.z = this.cameraItem.zPos;
        this.camera.position.x = this.cameraItem.xPos;
        this.camera.position.y = this.cameraItem.yPos;
    } else {
      this.camera = new THREE.OrthographicCamera(
        this.orthographicCameraItem.left,
        this.orthographicCameraItem.right,
        this.orthographicCameraItem.top,
        this.orthographicCameraItem.bottom,
        this.orthographicCameraItem.near,
        this.orthographicCameraItem.far
      );
      this.camera.position.z = this.orthographicCameraItem.zPos;
      this.camera.position.x = this.orthographicCameraItem.xPos;
      this.camera.position.y = this.orthographicCameraItem.yPos;
    }
  }

  updateCamera(): void
  {
    this.setupCamera();
  }

  updateCameraType(cameraType: CameraType): void
  {
    this.cameraType = cameraType;
    this.updateCamera();
  }

  addLight(lightItem: LightInterface): LightInterface
  {
    this.lightItems.push(lightItem);
    this.lightListSignal.set(this.lightItems);

    return lightItem;
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

      if (this.animationValue())
      {
        this.meshes.forEach(
          (mesh) => {
            mesh.rotation.x = time / 2000;
            mesh.rotation.y = time / 1000;
          }
        );
      }

      this.renderer.render( this.scene, this.camera );
    }

    return animation;
  }

  attachDom(vizDiv: HTMLDivElement): void
  {
    vizDiv.appendChild( this.renderer.domElement );
  }
}