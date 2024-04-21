import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';

import * as THREE from 'three';
import { BoxGeometry, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshPhongMaterial, Object3DEventMap, OrthographicCamera, PerspectiveCamera, PointLight, Scene, WebGLRenderer } from 'three';
import { MeshInterface, SupportedMeshes } from './interfaces/mesh-interface';
import { PerspectiveCameraInterface, OrthographicCameraInterface, CameraType, SupportedCameras } from './interfaces/camera-interfaces';
import { LightInterface, SupportedLights } from './interfaces/light-interface';
import { SceneInterface } from './interfaces/scene-interface';
import { RendererInterface } from './interfaces/renderer-interface';
import { AnimationInterface, AnimationPair } from './interfaces/animations-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ThreejsService {

  clock = new THREE.Clock();

  animationItem: AnimationInterface = {
    looping: true,
    running: true,
    time: 3,
    pause: false,
    pauseTime: 0
  };
  cameraType: CameraType = 'perspective';
  width = 0;
  height = 0;
  orthographicCamera: OrthographicCamera = new THREE.OrthographicCamera();
  orthographicCameraItem: OrthographicCameraInterface = {
    id: -1,
    name: 'orthographicCamera',
    left: -6,
    right: 6,
    top: 5,
    bottom: -5,
    near: .01,
    far: 2000,
    xPos: 0,
    yPos: 0,
    zPos: 5,
    xLookat: 0,
    yLookat: 0,
    zLookat: 0,
    type: 'orthographic-camera',
    animated: false
  };
  camera: SupportedCameras[] = [new THREE.PerspectiveCamera()];
  cameraItem: PerspectiveCameraInterface = {
    id: this.camera[0].id,
    name: 'Perspective Camera', 
    fov: 70,
    aspect: 1,
    near: .01,
    far: 2000,
    xPos: 0,
    yPos: 0,
    zPos: 5,
    xLookat: 0,
    yLookat: 0,
    zLookat: 0,
    type: 'perspective-camera',
    animated: false
  };
  rendererItem: RendererInterface = { castShadows: true };
  meshes: SupportedMeshes[] = [];
  lights: SupportedLights[] = [];
  renderer: WebGLRenderer = new THREE.WebGLRenderer( { antialias: true } );
  scene: Scene = new THREE.Scene();
  sceneItem: SceneInterface = {
    bgRedColor: 0,
    bgGreenColor: 0,
    bgBlueColor: 0
  };

  meshItems: MeshInterface[] = [];
  lightItems: LightInterface[] = [];
  
  animationsPairs: AnimationPair[] = [];

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

  private animationSignal: WritableSignal<AnimationInterface> = signal(this.animationItem);
  animationValue: Signal<AnimationInterface> = computed( () => this.animationSignal());

  private animationPairSignal: WritableSignal<AnimationPair[]> = signal(this.animationsPairs);
  animationPairValues: Signal<AnimationPair[]> = computed( () => this.animationPairSignal());

  private sceneSignal: WritableSignal<SceneInterface> = signal(this.sceneItem);
  sceneItemValues: Signal<SceneInterface> = computed( () => this.sceneSignal());

  private rendererSignal: WritableSignal<RendererInterface> = signal(this.rendererItem);
  rendererItemValues: Signal<RendererInterface> = computed( () => this.rendererSignal());

  updateAnimation(animation: AnimationInterface): void
  {
    this.animationSignal.set(animation);
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
      this.camera = [new THREE.PerspectiveCamera( 
        this.cameraItem.fov, 
        this.cameraItem.aspect, 
        this.cameraItem.near, 
        this.cameraItem.far)];
        this.cameraItem.id =  this.camera[0].id;
        this.camera[0].position.z = this.cameraItem.zPos;
        this.camera[0].position.x = this.cameraItem.xPos;
        this.camera[0].position.y = this.cameraItem.yPos;
        this.camera[0].lookAt(this.cameraItem.xLookat, this.cameraItem.yLookat, this.cameraItem.zLookat);
    } else {
      this.camera = [new THREE.OrthographicCamera(
        this.orthographicCameraItem.left,
        this.orthographicCameraItem.right,
        this.orthographicCameraItem.top,
        this.orthographicCameraItem.bottom,
        this.orthographicCameraItem.near,
        this.orthographicCameraItem.far
      )];
      this.orthographicCameraItem.id =  this.camera[0].id;
      this.camera[0].position.z = this.orthographicCameraItem.zPos;
      this.camera[0].position.x = this.orthographicCameraItem.xPos;
      this.camera[0].position.y = this.orthographicCameraItem.yPos;
      this.camera[0].lookAt(this.orthographicCameraItem.xLookat, this.orthographicCameraItem.yLookat, this.orthographicCameraItem.zLookat);
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

  updateRenderer(renderItem: RendererInterface): void
  {
    this.rendererItem = renderItem;
  }

  addLight(lightItem: LightInterface): LightInterface
  {
    this.lightItems.push(lightItem);
    this.lightItems = [... this.lightItems];
    const light = new THREE.PointLight();
    this.lights.push(light);
    light.intensity = lightItem.intensity;
    light.position.setX(lightItem.xPos.startValue);
    light.position.setY(lightItem.yPos.startValue);
    light.position.setZ(lightItem.zPos.startValue);
    lightItem.id = light.id;
    light.castShadow = lightItem.castShadow;
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
      light.position.setX(lightItem.xPos.startValue);
      light.position.setY(lightItem.yPos.startValue);
      light.position.setZ(lightItem.zPos.startValue);
      light.intensity = lightItem.intensity;
      if (lightItem.name)
      {
        light.name = lightItem.name;
      }
      light.color.setRGB(lightItem.redColor/255,lightItem.greenColor/255,lightItem.blueColor/255);
      light.castShadow = lightItem.castShadow;

      if (lightItem.animated && light) {
        this.setAnimationPairs(lightItem, light);
      } else {
        this.pruneAnimationPairs();
      }

      this.lightItems = [... this.lightItems];
      this.lightListSignal.set(this.lightItems);

      this.animationsPairs = [... this.animationsPairs];
      this.animationPairSignal.set(this.animationsPairs);
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

      // delete any animation pairs that have been deleted
      // huge risk of a memory leak if stale pairs are not
      // deleted

      this.animationsPairs = this.animationsPairs
            .filter( (pair: AnimationPair) => pair.item.id !== id );

      this.pruneAnimationPairs();

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
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.scene.add( mesh );

    this.setAnimationPairs(meshItem, mesh);

    return meshItem;
  }

  setAnimationPairs(item: MeshInterface | LightInterface, threeObj: SupportedMeshes | SupportedLights): void
  {
    const pair = this.animationsPairs
                  .find( (pair) => pair.item.id === item.id );
    if (item.animated && !pair)
    {
      const animationPair: AnimationPair = { item, threeObj };
      this.animationsPairs.push(animationPair);
      this.animationsPairs = [... this.animationsPairs];
      this.animationPairSignal.set(this.animationsPairs);
    }
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
    
    if (meshItem.shape === 'BoxGeometry' && updateMesh) {
      const geo: THREE.BoxGeometry = updateMesh.geometry as THREE.BoxGeometry;
      
      if (geo.parameters.width !== meshItem.width 
          || geo.parameters.height !== meshItem.height
          || geo.parameters.depth !== meshItem.depth)
      {
        const newGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(meshItem.width, meshItem.height, meshItem.depth, 1);
        updateMesh.geometry = newGeometry;
      }
    }

    if (meshItem.shape === 'SphereGeometry' && updateMesh) {
      const geo: THREE.SphereGeometry = updateMesh.geometry as THREE.SphereGeometry;
      
      if (geo.parameters.radius !== meshItem.radius)
      {
        const newGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(meshItem.radius, 32, 32);
        updateMesh.geometry = newGeometry;
      }
    }

    if (updateMesh) {
      updateMesh.name = meshItem.name;
      updateMesh.position.setX(meshItem.xPos.startValue);
      updateMesh.position.setY(meshItem.yPos.startValue);
      updateMesh.position.setZ(meshItem.zPos.startValue);
      updateMesh.castShadow = meshItem.castShadow;
      updateMesh.receiveShadow = meshItem.receiveShadow;
    }


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

    this.meshItems = [... this.meshItems];
    this.meshListSignal.set(this.meshItems);

    if (meshItem.animated && updateMesh) {
      this.setAnimationPairs(meshItem, updateMesh);
    } else {
      this.pruneAnimationPairs();
    }
    this.animationsPairs = [... this.animationsPairs];
    this.animationPairSignal.set(this.animationsPairs);

    this.clock.start();
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

      // delete any animation pairs that have been deleted
      // huge risk of a memory leak if stale pairs are not
      // deleted

      this.animationsPairs = this.animationsPairs
            .filter( (pair: AnimationPair) => pair.item.id !== id );

      this.pruneAnimationPairs();

    }

  }

  pruneAnimationPairs(): void
  {
    // basically deleted any pairs that are not animated
    const pairs: AnimationPair[] = this.animationsPairs
    .filter( (pair: AnimationPair | undefined) => (pair && pair.item.animated) );

    this.animationsPairs = pairs;
    this.animationPairSignal.set(this.animationsPairs);
  }

  setupRenderer(): void
  {
    this.renderer.setSize( this.width, this.height );
    this.renderer.setAnimationLoop( this.animationCallback() );
  }

  animationCallback(): XRFrameRequestCallback
  {
    const animation: XRFrameRequestCallback = ( time: number ) => {

      const currentLoopTime = this.clock.getElapsedTime();

      if(
        this.animationItem.looping
        && currentLoopTime > this.animationItem.time ) {
        this.resetClock();
      }
      
      
      if (this.animationItem.running)
      {
        this.lights.forEach(
          (light) => {
            const lightItem: LightInterface | undefined = this.getLightItemForId(light.id);

            if (lightItem && lightItem.animated){
              if (this.animationItem.pause) {
                this.updateLightForTime(light, lightItem, this.animationItem.pauseTime);
              } else {
                this.updateLightForTime(light, lightItem, this.clock.elapsedTime);
              }
            }

          }
        );
        this.meshes.forEach(
          (mesh) => {
            const meshItem: MeshInterface | undefined = this.getMeshItemForId(mesh.id);

            if (meshItem && meshItem.animated)
            {
              mesh.rotation.x = time / 2000;
              mesh.rotation.y = time / 1000;
  
              if (this.animationItem.pause) {
                this.updateMeshForTime(mesh, meshItem, this.animationItem.pauseTime);
              } else {
                this.updateMeshForTime(mesh, meshItem, this.clock.elapsedTime);
              }
            }
          }
        );
        
      }

      if (this.renderer.shadowMap.enabled !== this.rendererItem.castShadows) {
        // this doesn't work by itself the lights need to be turned off as well
        this.renderer.shadowMap.enabled = this.rendererItem.castShadows;

        this.lights.forEach(
          (light) => 
          {
            if (this.renderer.shadowMap.enabled)
            {
              const lightItem: LightInterface | undefined = this.lightItems.find(li => li.id === light.id);
              if (lightItem)
              {
                light.castShadow = lightItem.castShadow;
              }
            } else {
              light.castShadow = this.rendererItem.castShadows;
            }
          }
        );
      }

      this.renderer.render( this.scene, this.camera[0] );
    }

    return animation;
  }

  getMeshItemForId(meshId: number): MeshInterface | undefined
  {
    return this.meshItems.find(
      (mi: MeshInterface) => mi.id === meshId
    );

  }

  getLightItemForId(lightId: number): LightInterface | undefined
  {
    return this.lightItems.find(
      (li: LightInterface) => li.id === lightId
    );
  }

  updateMeshForTime(
    mesh: SupportedMeshes,
    meshItem: MeshInterface | undefined,
    time: number
  ): void
  {
    if (meshItem)
    {
      let xSpeed = 0; 
      let ySpeed = 0; 
      let zSpeed = 0; 

      if (meshItem.xPos.animated) {
        xSpeed = (meshItem.xPos.endValue*1 - meshItem.xPos.startValue*1)/this.animationItem.time;
      }

      if (meshItem.yPos.animated) {
        ySpeed = (meshItem.yPos.endValue*1 - meshItem.yPos.startValue*1)/this.animationItem.time;
      }

      if (meshItem.zPos.animated) {
        zSpeed = (meshItem.zPos.endValue*1 - meshItem.zPos.startValue*1)/this.animationItem.time;
      }

      mesh.position.setX(meshItem.xPos.startValue*1 + xSpeed * time);
      mesh.position.setY(meshItem.yPos.startValue*1 + ySpeed * time);
      mesh.position.setZ(meshItem.zPos.startValue*1 + zSpeed * time);
    }
  }

  updateLightForTime(
    light: SupportedLights,
    lightItem: LightInterface | undefined,
    time: number
  ): void
  {
    if (lightItem)
    {
      let xSpeed = 0; 
      let ySpeed = 0; 
      let zSpeed = 0; 

      if (lightItem.xPos.animated) {
        xSpeed = (lightItem.xPos.endValue*1 - lightItem.xPos.startValue*1)/this.animationItem.time;
      }

      if (lightItem.yPos.animated) {
        ySpeed = (lightItem.yPos.endValue*1 - lightItem.yPos.startValue*1)/this.animationItem.time;
      }

      if (lightItem.zPos.animated) {
        zSpeed = (lightItem.zPos.endValue*1 - lightItem.zPos.startValue*1)/this.animationItem.time;
      }

      light.position.setX(lightItem.xPos.startValue*1 + xSpeed * time);
      light.position.setY(lightItem.yPos.startValue*1 + ySpeed * time);
      light.position.setZ(lightItem.zPos.startValue*1 + zSpeed * time);
    }
  }

  attachDom(vizDiv: HTMLDivElement): void
  {
    vizDiv.appendChild( this.renderer.domElement );
  }

  resetClock(): void {
    this.clock.start();

    this.meshes.forEach(
      (mesh) => {
        this.updateMeshForTime(mesh, this.getMeshItemForId(mesh.id), this.clock.elapsedTime);
      }
    );

    this.lights.forEach(
      (light) => {
        this.updateLightForTime(light, this.getLightItemForId(light.id), this.clock.elapsedTime);
      }
    );
  }
}