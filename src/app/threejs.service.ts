import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';

import * as THREE from 'three';
import { BoxGeometry, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshPhongMaterial, Object3DEventMap, OrthographicCamera, PerspectiveCamera, PointLight, Scene, WebGLRenderer } from 'three';
import { MeshInterface, SupportedMeshes } from './interfaces/mesh-interface';
import { PerspectiveCameraInterface, OrthographicCameraInterface, CameraType } from './interfaces/camera-interfaces';
import { LightInterface } from './interfaces/light-interface';
import { SceneInterface } from './interfaces/scene-interface';

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
  meshes: SupportedMeshes[] = [];
  lights: PointLight[] = [];
  renderer: WebGLRenderer = new THREE.WebGLRenderer( { antialias: true } );
  scene: Scene = new THREE.Scene();
  sceneItem: SceneInterface = {
    bgRedColor: 0,
    bgGreenColor: 0,
    bgBlueColor: 0
  };

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

  private sceneSignal: WritableSignal<SceneInterface> = signal(this.sceneItem);
  sceneItemValues: Signal<SceneInterface> = computed( () => this.sceneSignal());

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

  setUpScene(): void
  {
    this.scene.background = new THREE.Color()
                            .setRGB(
                              this.sceneItem.bgRedColor/255,
                              this.sceneItem.bgGreenColor/255,
                              this.sceneItem.bgBlueColor/255
                            );
  }

  updateScene(sceneItem: SceneInterface): void
  {
    this.sceneItem = { ...sceneItem }; // shallow clone
    this.sceneSignal.set(this.sceneItem);
    this.setUpScene();
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
    this.lightItems = [... this.lightItems];
    const light = new THREE.PointLight();
    this.lights.push(light);
    light.intensity = lightItem.intensity;
    light.position.setX(lightItem.xPos);
    light.position.setY(lightItem.yPos);
    light.position.setZ(lightItem.zPos);
    lightItem.id = light.id;
    this.lightListSignal.set(this.lightItems);
    this.scene.add( light );

    return lightItem;
  }

  updateLight(lightItem: LightInterface): void
  {
    const light = this.lights.find( (light: PointLight) => {
      return (light.id === lightItem.id)
    } );

    if (light)
    {
      light.position.setX(lightItem.xPos);
      light.position.setY(lightItem.yPos);
      light.position.setZ(lightItem.zPos);
      light.intensity = lightItem.intensity;
      if (lightItem.name)
      {
        light.name = lightItem.name;
      }
      light.color.setRGB(lightItem.redColor/255,lightItem.greenColor/255,lightItem.blueColor/255);
    }
  }

  deleteLight(lightItem: LightInterface): void
  {
    const light = this.lights.find( (light: PointLight) => {
      return (light.id === lightItem.id)
    } );

    const id = lightItem.id;

    if(light)
    {
      this.scene.remove(light);
      this.lights = this.lights.filter((light) => light.id !== id);

      this.lightItems = this.lightItems.filter((light) => light.id !== id);

      this.lightListSignal.set(this.lightItems);
    }

  }

  addMesh(meshItem: MeshInterface): MeshInterface
  {
    let geometry: BoxGeometry | THREE.SphereGeometry = new THREE.BoxGeometry( 1, 1, 1 );

    if (meshItem.shape === 'SphereGeometry') {
      geometry = new THREE.SphereGeometry(.5,32,32);
    }

    let material: MeshNormalMaterial | MeshPhongMaterial | MeshBasicMaterial = new THREE.MeshNormalMaterial();

    
    if (meshItem.materialType === 'basic') {
      material = new THREE.MeshBasicMaterial();
    } else if (meshItem.materialType === 'phong') {
      material = new THREE.MeshPhongMaterial();
    }

    const mesh: SupportedMeshes = new THREE.Mesh( geometry, material );
    meshItem.id = mesh.id;
    this.meshes.push(mesh);

    this.updateMesh(meshItem);    

    this.meshItems.push( meshItem );

    this.meshItems = [... this.meshItems];

    this.meshListSignal.set(this.meshItems);

    this.scene.add( mesh );

    return meshItem;
  }

  updateMesh(meshItem: MeshInterface): void
  {
    const updateMesh = this.meshes.find((mesh) => mesh.id === meshItem.id);

    if (updateMesh?.geometry.type !== meshItem.shape) {
      // the mesh needs to be converted
      if (updateMesh && meshItem.shape === 'SphereGeometry') {
        const geometry: THREE.SphereGeometry = new THREE.SphereGeometry(.5, 32, 32);
        // the commented code was povided by chatGPT but does not seem to be necessary
        //updateMesh.geometry.dispose();
        updateMesh.geometry = geometry;
        // updateMesh.updateMatrix();
        // updateMesh.geometry.computeBoundingBox();
      } else if (updateMesh) {
        const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1, 1);
        // the commented code was povided by chatGPT but does not seem to be necessary
        //updateMesh.geometry.dispose();
        updateMesh.geometry = geometry;
        // updateMesh.updateMatrix();
        // updateMesh.geometry.computeBoundingBox();
      }
    }

    updateMesh?.position.setX(meshItem.xPos);
    updateMesh?.position.setY(meshItem.yPos);
    updateMesh?.position.setZ(meshItem.zPos);

    let updateMaterial = false;
    if (
      (updateMesh?.material.type === "MeshNormalMaterial"
      && meshItem.materialType !== 'normal')
      || (updateMesh?.material.type === "MeshBasicMaterial"
      && meshItem.materialType !== 'basic')
      || (updateMesh?.material.type === "MeshPhongMaterial"
      && meshItem.materialType !== 'phong')
      ) {
        updateMaterial = true;
    }

    if (updateMaterial) {
      if (meshItem.materialType === 'basic' && updateMesh) {
        const newMaterial = new THREE.MeshBasicMaterial();
        updateMesh.material = newMaterial;
      } else if (meshItem.materialType === 'normal' && updateMesh) {
        const newMaterial = new THREE.MeshNormalMaterial();
        updateMesh.material = newMaterial;
      } else if (meshItem.materialType === 'phong' && updateMesh) {
        const newMaterial = new THREE.MeshPhongMaterial();
        updateMesh.material = newMaterial;
      }
    }

    if (meshItem.materialType === 'basic' && updateMesh) {
      const material = updateMesh.material as MeshBasicMaterial;
      material.color.setRGB(meshItem.redColor/255,meshItem.greenColor/255,meshItem.blueColor/255);
    }

    if (meshItem.materialType === 'phong' && updateMesh) {
      const material = updateMesh.material as MeshPhongMaterial;
      material.color.setRGB(meshItem.redColor/255,meshItem.greenColor/255,meshItem.blueColor/255)
    }
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