import { Injectable, Signal, WritableSignal, computed, signal, inject } from '@angular/core';

import * as THREE from 'three';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { BoxGeometry, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshPhongMaterial, Object3DEventMap, OrthographicCamera, PerspectiveCamera, PointLight, Scene, SphereGeometry, WebGLRenderer } from 'three';
import { MeshInterface, SupportedMeshes } from '../interfaces/mesh-interface';
import { PerspectiveCameraInterface, OrthographicCameraInterface, CameraType, SupportedCameras, SupportedCameraItems } from '../interfaces/camera-interfaces';
import { LightInterface, SupportedLights } from '../interfaces/light-interface';
import { SceneInterface } from '../interfaces/scene-interface';
import { RendererInterface } from '../interfaces/renderer-interface';
import { AnimationInterface, AnimationPair, MappedSupportedPropertyTypesSignal, PropertyMenuItem } from '../interfaces/animations-interfaces';
import { AnimationService } from './animation.service';

@Injectable({
  providedIn: 'root'
})
export class ThreejsService {

  private animationService: AnimationService = inject(AnimationService);

  cameraType: CameraType = 'PerspectiveCamera';
  width = 0;
  height = 0;
  orthographicCamera: OrthographicCamera = new THREE.OrthographicCamera();
  orthographicCameraItem: OrthographicCameraInterface = {
    id: -1,
    name: 'orthographic Camera',
    left: -6,
    right: 6,
    top: 5,
    bottom: -5,
    near: .01,
    far: 2000,
    xPos: {startValue: 0, endValue: 0, animated: true},
    yPos: {startValue: 0, endValue: 0, animated: true},
    zPos: {startValue: 5, endValue: 5, animated: true},
    xLookat: {startValue: 0, endValue: 0, animated: true},
    yLookat: {startValue: 0, endValue: 0, animated: true},
    zLookat: {startValue: 0, endValue: 0, animated: true},
    type: 'OrthographicCamera',
    animated: false
  };
  cameras: SupportedCameras[] = [new THREE.PerspectiveCamera()];

  cameraItem: PerspectiveCameraInterface = {
    id: this.cameras[0].id,
    name: 'Perspective Camera', 
    fov: 70,
    aspect: 1,
    near: .01,
    far: 2000,
    xPos: {startValue: 0, endValue: 0, animated: true},
    yPos: {startValue: 0, endValue: 0, animated: true},
    zPos: {startValue: 5, endValue: 5, animated: true},
    xLookat: {startValue: 0, endValue: 0, animated: true},
    yLookat: {startValue: 0, endValue: 0, animated: true},
    zLookat: {startValue: 0, endValue: 0, animated: true},
    type: 'PerspectiveCamera',
    animated: false
  };
  cameraItems: SupportedCameraItems[] = [this.cameraItem];  
  rendererItem: RendererInterface = { castShadows: true };
  meshes: SupportedMeshes[] = [];
  lights: SupportedLights[] = [];
  renderer: WebGLRenderer = new THREE.WebGLRenderer( { antialias: true } );
  scenes: Scene[] = [new THREE.Scene()]
  sceneItem: SceneInterface = {
    id: this.scenes[0].id,
    name: 'Scene',
    redColor: {startValue: 0, endValue: 0, animated: true},
    greenColor: {startValue: 0, endValue: 0, animated: true},
    blueColor: {startValue: 0, endValue: 0, animated: true},
    type: 'Scene',
    animated: false
  };
  sceneItems: SceneInterface[] = [this.sceneItem];

  meshItems: MeshInterface[] = [];
  lightItems: LightInterface[] = [];
  

  private initialized: WritableSignal<boolean> = signal(false);
  isInitiazed: Signal<boolean> = computed( () => this.initialized() );

  private meshListSignal: WritableSignal<MeshInterface[]> = signal(this.meshItems);
  meshList: Signal<MeshInterface[]> = computed( () => this.meshListSignal() );

  private lightListSignal: WritableSignal<LightInterface[]> = signal(this.lightItems);
  lightListValues: Signal<LightInterface[]> = computed( () => this.lightListSignal() );

  private cameraItemSignal: WritableSignal<SupportedCameraItems[]> = signal(this.cameraItems);
  cameraItemValues: Signal<SupportedCameraItems[]> = computed( () => this.cameraItemSignal() );

  private orthographicCameraItemSignal: WritableSignal<OrthographicCameraInterface> = signal(this.orthographicCameraItem);
  orthographicCameraItemValues: Signal<OrthographicCameraInterface> = computed( () => this.orthographicCameraItemSignal() );

  private animationSignal: WritableSignal<AnimationInterface> = signal(this.animationService.animationItem);
  animationValue: Signal<AnimationInterface> = computed( () => this.animationSignal());

  private animationPairSignal: WritableSignal<AnimationPair[]> = signal(this.animationService.animationsPairs);
  animationPairValues: Signal<AnimationPair[]> = computed( () => this.animationPairSignal());

  private sceneSignal: WritableSignal<SceneInterface> = signal(this.sceneItem);
  sceneItemValues: Signal<SceneInterface> = computed( () => this.sceneSignal());

  private rendererSignal: WritableSignal<RendererInterface> = signal(this.rendererItem);
  rendererItemValues: Signal<RendererInterface> = computed( () => this.rendererSignal());

  private animationMenuItemSignal: WritableSignal<PropertyMenuItem[]> = signal(this.animationService.menuItems);
  animationMenuItemValues: Signal<PropertyMenuItem[]> = computed( () => this.animationMenuItemSignal());
  
  private mappedSupportedPropertyTypesSignal: WritableSignal<MappedSupportedPropertyTypesSignal> = signal(
    {
      supportedPropertyTypes: this.animationService.supportedPropsDictionary,
      signalType: 'MappedSupportedPropertyTypes'
    });
  mappedSupportedPropertyTypesValues: Signal<MappedSupportedPropertyTypesSignal> = computed(() => this.mappedSupportedPropertyTypesSignal())
  loader = new FontLoader();

 helvetikerRegularPromise: Promise<Font> = new Promise((resolve) => { 
  this.loader.load('assets/fonts/helvetiker_regular.typeface.json', 
    (font: Font) => { resolve(font); }
  )}) ; 

  constructor() {

  }

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
    this.scenes[0].background = new THREE.Color()
                            .setRGB(
                              this.sceneItem.redColor.startValue/255,
                              this.sceneItem.greenColor.startValue/255,
                              this.sceneItem.blueColor.startValue/255
                            );
  }

  updateScene(sceneItem: SceneInterface): void
  {
    this.sceneItem = { ...sceneItem }; // shallow clone
    this.sceneItems = [ this.sceneItem ];
    this.sceneSignal.set(this.sceneItem);
    this.setUpScene();

    if (this.sceneItem.animated) {
      this.animationService.setAnimationPairs(this.sceneItem, this.scenes[0]);
      this.animationPairSignal.set(this.animationService.animationsPairs);
    } else {
      this.animationService.pruneAnimationPairs();
      this.animationPairSignal.set(this.animationService.animationsPairs);
    }
  }

  setupCamera(init = false): void
  {
    if (this.cameraType === 'PerspectiveCamera')
    {
      this.cameras = [new THREE.PerspectiveCamera( 
        this.cameraItem.fov, 
        this.cameraItem.aspect, 
        this.cameraItem.near, 
        this.cameraItem.far)];
        this.cameraItem.id =  this.cameras[0].id;
        this.cameras[0].position.z = this.cameraItem.zPos.startValue;
        this.cameras[0].position.x = this.cameraItem.xPos.startValue;
        this.cameras[0].position.y = this.cameraItem.yPos.startValue;
        this.cameras[0].lookAt(this.cameraItem.xLookat.startValue, this.cameraItem.yLookat.startValue, this.cameraItem.zLookat.startValue);

        if (this.cameraItem.animated) {
          this.animationService.setAnimationPairs(this.cameraItem, this.cameras[0]);
          this.animationPairSignal.set(this.animationService.animationsPairs);
        } else {
          this.animationService.pruneAnimationPairs();
          if (!init) { // this prevents a console error (Error: NG0600: Writing to signals is not allowed in a `computed` or an `effect` by default.)
            this.animationPairSignal.set(this.animationService.animationsPairs);
          }
        }
        this.cameraItems = [this.cameraItem];
    } else {
      this.cameras = [new THREE.OrthographicCamera(
        this.orthographicCameraItem.left,
        this.orthographicCameraItem.right,
        this.orthographicCameraItem.top,
        this.orthographicCameraItem.bottom,
        this.orthographicCameraItem.near,
        this.orthographicCameraItem.far
      )];
      this.orthographicCameraItem.id =  this.cameras[0].id;
      this.cameras[0].position.z = this.orthographicCameraItem.zPos.startValue;
      this.cameras[0].position.x = this.orthographicCameraItem.xPos.startValue;
      this.cameras[0].position.y = this.orthographicCameraItem.yPos.startValue;
      this.cameras[0].lookAt(this.orthographicCameraItem.xLookat.startValue, this.orthographicCameraItem.yLookat.startValue, this.orthographicCameraItem.zLookat.startValue);

      if (this.orthographicCameraItem.animated) {
        this.animationService.setAnimationPairs(this.orthographicCameraItem, this.cameras[0]);
        this.animationPairSignal.set(this.animationService.animationsPairs);
      } else {
        this.animationService.pruneAnimationPairs();
        this.animationPairSignal.set(this.animationService.animationsPairs);
      }

      this.cameraItems = [this.orthographicCameraItem];
    }
    // setting the camearItemsSignal here caused an error
    // since this method is called from an effect
    // this.cameraItemSignal.set(this.cameraItems);
  }

  updateCamera(): void
  {

    // there is an issue here... setup blows away the 
    // old camera an creates a new camera... this leads
    // to a huge (not size, but likelihood) memory leak risk
    // and just seems like bad idea... need to refactor
    // so a new camera is created only if the type of camera
    // changes.
    // #1 determine if the current camera type has changed
    if (this.cameraType === this.cameras[0].type)
    {
      const currentCamera = this.cameras[0];
      let isAnimated = false;
      let xPos = 0;
      let yPos = 0;
      let zPos = 0;
      let far = 0;
      let near = 0;
      if (this.cameraType === 'PerspectiveCamera')
        {
          const camera: PerspectiveCamera = this.cameras[0] as PerspectiveCamera;
          // orthagraphic camera does not have these four that's why they need to be separate.
          camera.fov = this.cameraItem.fov;
          camera.aspect = this.cameraItem.aspect;
          near = this.cameraItem.near;
          far = this.cameraItem.far;
          xPos = this.cameraItem.xPos.startValue;
          yPos = this.cameraItem.yPos.startValue;
          zPos = this.cameraItem.zPos.startValue;
          isAnimated = this.cameraItem.animated;
          this.cameraItems = [this.cameraItem];

          if (isAnimated) {
            this.animationService.setAnimationPairs(this.cameraItem, this.cameras[0]);
            this.animationPairSignal.set(this.animationService.animationsPairs);
          } else {
            this.animationService.pruneAnimationPairs();
            this.animationPairSignal.set(this.animationService.animationsPairs);
          }

        } else {
          const camera: OrthographicCamera = this.cameras[0] as OrthographicCamera;
          camera.left = this.orthographicCameraItem.left;
          camera.right = this.orthographicCameraItem.right;
          camera.top = this.orthographicCameraItem.top;
          camera.bottom = this.orthographicCameraItem.bottom;
          near = this.orthographicCameraItem.near;
          far = this.orthographicCameraItem.far;
          xPos = this.orthographicCameraItem.xPos.startValue;
          yPos = this.orthographicCameraItem.yPos.startValue;
          zPos = this.orthographicCameraItem.zPos.startValue;
          isAnimated = this.orthographicCameraItem.animated;    
          this.cameraItems = [this.orthographicCameraItem];

          if (isAnimated) {
            this.animationService.setAnimationPairs(this.orthographicCameraItem, this.cameras[0]);
            this.animationPairSignal.set(this.animationService.animationsPairs);
          } else {
            this.animationService.pruneAnimationPairs();
            this.animationPairSignal.set(this.animationService.animationsPairs);
          }

        }

        currentCamera.position.x = xPos;
        currentCamera.position.y = yPos;
        currentCamera.position.z = zPos;
        currentCamera.near = near;
        currentCamera.far = far;
        currentCamera.lookAt(this.cameraItem.xLookat.startValue, this.cameraItem.yLookat.startValue, this.cameraItem.zLookat.startValue);

      } else {
      this.setupCamera();
    }
    this.cameraItemSignal.set(this.cameraItems);
  }

  updateCameraType(cameraType: CameraType): void
  {
    this.cameraType = cameraType;

    // delete the old camera from the pairs list if it exists
    this.animationService.animationsPairs = this.animationService.animationsPairs
            .filter( (pair: AnimationPair) => pair.item.id !== this.cameras[0].id );
    this.animationPairSignal.set(this.animationService.animationsPairs);
    // creates a new camera
    this.setupCamera();
    this.cameraItemSignal.set(this.cameraItems);

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
    this.scenes[0].add( light );

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
        this.animationService.setAnimationPairs(lightItem, light);
        this.animationPairSignal.set(this.animationService.animationsPairs);
      } else {
        this.animationService.pruneAnimationPairs();
        this.animationPairSignal.set(this.animationService.animationsPairs);
      }

      this.lightItems = [... this.lightItems];
      this.lightListSignal.set(this.lightItems);

      this.animationService.animationsPairs = [... this.animationService.animationsPairs];
      this.animationPairSignal.set(this.animationService.animationsPairs);
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
      this.scenes[0].remove(light);
      this.lights = this.lights.filter((light) => light.id !== id);

      this.lightItems = this.lightItems.filter((light) => light.id !== id);

      this.lightListSignal.set(this.lightItems);

      // delete any animation pairs that have been deleted
      // huge risk of a memory leak if stale pairs are not
      // deleted

      this.animationService.animationsPairs = this.animationService.animationsPairs
            .filter( (pair: AnimationPair) => pair.item.id !== id );

      this.animationService.pruneAnimationPairs();
      this.animationPairSignal.set(this.animationService.animationsPairs);
    }

  }

  async addMesh(meshItem: MeshInterface): Promise<MeshInterface>
  {
    let font = await this.helvetikerRegularPromise;
    let geometry: BoxGeometry | SphereGeometry | TextGeometry = new THREE.BoxGeometry( 1, 1, 1 );

    if (meshItem.shape === 'SphereGeometry') {
      geometry = new THREE.SphereGeometry(.5,32,32);
    } else if (meshItem.shape === 'TextGeometry') {
      geometry = await this.getTextGeometry(meshItem);
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

    this.scenes[0].add( mesh );

    this.animationService.setAnimationPairs(meshItem, mesh);
    this.animationPairSignal.set(this.animationService.animationsPairs);

    return meshItem;
  }

  async updateMesh(meshItem: MeshInterface): Promise<void>
  {
    const updateMesh = this.meshes.find((mesh) => mesh.id === meshItem.id);
    const font = await this.helvetikerRegularPromise;

    if (updateMesh?.geometry.type !== meshItem.shape) {
      // the mesh needs to be converted
      if (updateMesh && meshItem.shape === 'SphereGeometry') {
        const geometry: THREE.SphereGeometry = new THREE.SphereGeometry(.5, 32, 32);
        // the commented code was povided by chatGPT but does not seem to be necessary
        //updateMesh.geometry.dispose();
        updateMesh.geometry = geometry;
        // updateMesh.updateMatrix();
        // updateMesh.geometry.computeBoundingBox();
      } else if (updateMesh && meshItem.shape === 'BoxGeometry') {
        const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1, 1);
        // the commented code was povided by chatGPT but does not seem to be necessary
        //updateMesh.geometry.dispose();
        updateMesh.geometry = geometry;
        // updateMesh.updateMatrix();
        // updateMesh.geometry.computeBoundingBox();
      } else if (updateMesh && meshItem.shape === 'TextGeometry') {
        const geometry: TextGeometry  = await this.getTextGeometry(meshItem);
        updateMesh.geometry = geometry;
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

    if (meshItem.shape === 'TextGeometry' && updateMesh) {
      const geo: TextGeometry = updateMesh.geometry as TextGeometry;
      
      if (
        geo.parameters.options.height !== meshItem.height
        || geo.parameters.options.curveSegments !== meshItem.curveSegments
        || geo.parameters.options.size !== meshItem.size
        || geo.parameters.options.bevelOffset !== meshItem.bevelOffset
        || geo.parameters.options.bevelSegments !== meshItem.bevelSegments
        || geo.parameters.options.bevelSize !== meshItem.bevelSize
      )
      {
        const newGeometry: TextGeometry = await this.getTextGeometry(meshItem);
        updateMesh.geometry = newGeometry;
      }
    }

    if (updateMesh) {
      updateMesh.name = meshItem.name;
      updateMesh.position.setX(meshItem.xPos.startValue);
      updateMesh.position.setY(meshItem.yPos.startValue);
      updateMesh.position.setZ(meshItem.zPos.startValue);
      
      let xRotation = updateMesh.rotation.x;
      let yRotation = updateMesh.rotation.y;
      let zRotation = updateMesh.rotation.z;

      if (!isNaN(meshItem.xRotation.startValue*1))
      {
        xRotation = meshItem.xRotation.startValue * 1;
      }

      if (!isNaN(meshItem.yRotation.startValue*1))
      {
        yRotation = meshItem.yRotation.startValue * 1;
      }
      
      if (!isNaN(meshItem.zRotation.startValue*1))
      {
        zRotation = meshItem.zRotation.startValue * 1;
      }

      updateMesh.rotation.set(xRotation, yRotation, zRotation);
      
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
      this.animationService.setAnimationPairs(meshItem, updateMesh);
      this.animationPairSignal.set(this.animationService.animationsPairs);
    } else {
      this.animationService.pruneAnimationPairs();
      this.animationPairSignal.set(this.animationService.animationsPairs);
    }
    this.animationService.animationsPairs = [... this.animationService.animationsPairs];
    this.animationPairSignal.set(this.animationService.animationsPairs);

    this.animationService.clock.start();
  }

  async getTextGeometry(meshItem: MeshInterface): Promise<TextGeometry>
  {
    const font = await this.helvetikerRegularPromise;
    return new TextGeometry('i', {
      font: font,
      size: meshItem.size * 1,
      height: meshItem.height * 1,
      curveSegments: meshItem.curveSegments * 1,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: meshItem.bevelSize * 1,
      bevelOffset:  meshItem.bevelOffset * 1,
      bevelSegments:  meshItem.bevelSegments * 1,
      steps: 1
    });
  }

  deleteMesh(id: number): void
  {
    const mesh = this.meshes.find( (mesh) => mesh.id === id);

    if(mesh)
    {
      this.scenes[0].remove(mesh);
      this.meshes = this.meshes.filter((mesh) => mesh.id !== id);

      this.meshItems = this.meshItems.filter((mesh) => mesh.id !== id);

      this.meshListSignal.set(this.meshItems);

      // delete any animation pairs that have been deleted
      // huge risk of a memory leak if stale pairs are not
      // deleted

      this.animationService.animationsPairs = this.animationService.animationsPairs
            .filter( (pair: AnimationPair) => pair.item.id !== id );

      this.animationService.pruneAnimationPairs();
      this.animationPairSignal.set(this.animationService.animationsPairs);
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

      const currentLoopTime = this.animationService.clock.getElapsedTime();

      if(
        this.animationService.animationItem.looping
        && currentLoopTime > this.animationService.animationItem.time ) {
        this.resetClock();
      }
      
      
      if (this.animationService.animationItem.running)
      {
        this.cameras.forEach(
          (camera) => {
            const cameraItem:  PerspectiveCameraInterface | OrthographicCameraInterface | undefined = this.getCameraItemForId(camera.id);
            
            if (cameraItem && cameraItem.animated){
              if (this.animationService.animationItem.pause) {
                this.animationService.updateCameraForTime(camera, cameraItem, this.animationService.animationItem.pauseTime, this.animationService.animationItem.time);
              } else {
                this.animationService.updateCameraForTime(camera, cameraItem, this.animationService.clock.elapsedTime, this.animationService.animationItem.time);
              }
            }
          }
        );
        this.lights.forEach(
          (light) => {
            const lightItem: LightInterface | undefined = this.getLightItemForId(light.id);

            if (lightItem && lightItem.animated){
              if (this.animationService.animationItem.pause) {
                this.animationService.updateLightForTime(light, lightItem, this.animationService.animationItem.pauseTime, this.animationService.animationItem.time);
              } else {
                this.animationService.updateLightForTime(light, lightItem, this.animationService.clock.elapsedTime, this.animationService.animationItem.time);
              }
            }

          }
        );
        this.meshes.forEach(
          (mesh) => {
            const meshItem: MeshInterface | undefined = this.getMeshItemForId(mesh.id);

            if (meshItem && meshItem.animated)
            {  
              if (this.animationService.animationItem.pause) {
                this.animationService.updateMeshForTime(mesh, meshItem, this.animationService.animationItem.pauseTime, this.animationService.animationItem.time);
              } else {
                this.animationService.updateMeshForTime(mesh, meshItem, this.animationService.clock.elapsedTime, this.animationService.animationItem.time);
              }
            }
          }
        );
        this.scenes.forEach(
          (scene) => {
            const sceneItem: SceneInterface | undefined = this.getSceneItemForId(scene.id);

            if (sceneItem && sceneItem.animated)
              {
                if (this.animationService.animationItem.pause) {
                  this.animationService.updateSceneForTime(scene, sceneItem, this.animationService.animationItem.pauseTime, this.animationService.animationItem.time);
                } else {
                  this.animationService.updateSceneForTime(scene, sceneItem, this.animationService.clock.elapsedTime, this.animationService.animationItem.time);
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

      this.renderer.render( this.scenes[0], this.cameras[0] );
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

  getCameraItemForId(cameraId: number): PerspectiveCameraInterface | OrthographicCameraInterface | undefined
  {
    return this.cameraItems.find(
      (camera: SupportedCameraItems) => camera.id === cameraId
    );
  }

  getSceneItemForId(sceneId: number): SceneInterface | undefined
  {
    return this.sceneItems.find(
      (scene: SceneInterface) => scene.id === sceneId
    );
  }

  attachDom(vizDiv: HTMLDivElement): void
  {
    vizDiv.appendChild( this.renderer.domElement );
  }

  resetClock(): void {
    this.animationService.clock.start();

    this.meshes.forEach(
      (mesh) => {
        this.animationService.updateMeshForTime(mesh, this.getMeshItemForId(mesh.id), this.animationService.clock.elapsedTime, this.animationService.animationItem.time);
      }
    );

    this.lights.forEach(
      (light) => {
        this.animationService.updateLightForTime(light, this.getLightItemForId(light.id), this.animationService.clock.elapsedTime, this.animationService.animationItem.time);
      }
    );

    this.cameras.forEach(
      (camera) => {
        this.animationService.updateCameraForTime(camera, this.getCameraItemForId(camera.id), this.animationService.clock.elapsedTime, this.animationService.animationItem.time);
      }
    );

    this.scenes.forEach(
      (scene) => {
        this.animationService.updateSceneForTime(scene, this.getSceneItemForId(scene.id), this.animationService.clock.elapsedTime, this.animationService.animationItem.time);
      }
    );
  }
}