import { Injectable, Signal, WritableSignal, computed, signal, inject } from '@angular/core';

import * as THREE from 'three';
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { BoxGeometry, MeshBasicMaterial, MeshNormalMaterial, MeshPhongMaterial, OrthographicCamera, PerspectiveCamera, PointLight, SpotLight, Scene, SphereGeometry, WebGLRenderer } from 'three';
import { FontInterface, MeshInterface, SupportedMeshes } from '../interfaces/mesh-interface';
import { CameraInterface, CameraType, SupportedCameras } from '../interfaces/camera-interfaces';
import { LightInterface, SupportedLights } from '../interfaces/light-interface';
import { SceneInterface } from '../interfaces/scene-interface';
import { RendererInterface } from '../interfaces/renderer-interface';
import { AnimationInterface, AnimationPair, MappedSupportedPropertyTypesSignal, PropertyMenuItem } from '../interfaces/animations-interfaces';
import { AnimationService } from './animation.service';
import { MeshService } from './mesh.service';
import { CameraService } from './camera.service';

@Injectable({
  providedIn: 'root'
})
export class ThreejsService {

  private animationService: AnimationService = inject(AnimationService);
  private meshService: MeshService = inject(MeshService);
  private cameraService: CameraService = inject(CameraService);

  width = 0;
  height = 0;


  rendererItem: RendererInterface = { castShadows: true };
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

  lightItems: LightInterface[] = [];
  

  private initialized: WritableSignal<boolean> = signal(false);
  isInitiazed: Signal<boolean> = computed( () => this.initialized() );

  private meshListSignal: WritableSignal<MeshInterface[]> = signal(this.meshService.meshItems);
  meshList: Signal<MeshInterface[]> = computed( () => this.meshListSignal() );

  private lightListSignal: WritableSignal<LightInterface[]> = signal(this.lightItems);
  lightListValues: Signal<LightInterface[]> = computed( () => this.lightListSignal() );

  private cameraItemSignal: WritableSignal<CameraInterface[]> = signal(this.cameraService.cameraItems);
  cameraItemValues: Signal<CameraInterface[]> = computed( () => this.cameraItemSignal() );

  private orthographicCameraItemSignal: WritableSignal<CameraInterface> = signal(this.cameraService.orthographicCameraItem);
  orthographicCameraItemValues: Signal<CameraInterface> = computed( () => this.orthographicCameraItemSignal() );

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
  
  private fontListSignal: WritableSignal<FontInterface[]> = signal(this.meshService.fontList);
  fontListValues: Signal<FontInterface[]> = computed( () => this.fontListSignal());

  constructor() {

    this.meshService.fontPromises.then(
      () => {
        this.fontListSignal.set(Array.from(this.meshService.fontList));
      }
    )
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

    this.cameraService.cameraItem.aspect = this.width/this.height;
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
    this.cameraService.setupCamera(init);
    if (this.cameraService.cameraType === 'PerspectiveCamera')
    {
        if (this.cameraService.cameraItem.animated) {
          this.animationService.setAnimationPairs(this.cameraService.cameraItem, this.cameraService.cameras[0]);
          this.animationPairSignal.set(this.animationService.animationsPairs);
        } else {
          this.animationService.pruneAnimationPairs();
          if (!init) { // this prevents a console error (Error: NG0600: Writing to signals is not allowed in a `computed` or an `effect` by default.)
            this.animationPairSignal.set(this.animationService.animationsPairs);
          }
        }
    } else {
      if (this.cameraService.orthographicCameraItem.animated) {
        this.animationService.setAnimationPairs(this.cameraService.orthographicCameraItem, this.cameraService.cameras[0]);
        this.animationPairSignal.set(this.animationService.animationsPairs);
      } else {
        this.animationService.pruneAnimationPairs();
        this.animationPairSignal.set(this.animationService.animationsPairs);
      }
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
    if (this.cameraService.cameraType === this.cameraService.cameras[0].type)
    {
      let isAnimated = false;
      if (this.cameraService.cameraType === 'PerspectiveCamera')
        {
          isAnimated = this.cameraService.cameraItem.animated;

          if (isAnimated) {
            this.animationService.setAnimationPairs(this.cameraService.cameraItem, this.cameraService.cameras[0]);
            this.animationPairSignal.set(this.animationService.animationsPairs);
          } else {
            this.animationService.pruneAnimationPairs();
            this.animationPairSignal.set(this.animationService.animationsPairs);
          }
        } else {
          isAnimated = this.cameraService.orthographicCameraItem.animated;    
          if (isAnimated) {
            this.animationService.setAnimationPairs(this.cameraService.orthographicCameraItem, this.cameraService.cameras[0]);
            this.animationPairSignal.set(this.animationService.animationsPairs);
          } else {
            this.animationService.pruneAnimationPairs();
            this.animationPairSignal.set(this.animationService.animationsPairs);
          }

        }
      } else {
      this.setupCamera();
    }
    this.cameraItemSignal.set(this.cameraService.cameraItems);
  }

  updateCameraType(cameraType: CameraType): void
  {
    this.cameraService.cameraType = cameraType;

    // delete the old camera from the pairs list if it exists
    this.animationService.animationsPairs = this.animationService.animationsPairs
            .filter( (pair: AnimationPair) => pair.item.id !== this.cameraService.cameras[0].id );
    this.animationPairSignal.set(this.animationService.animationsPairs);
    // creates a new camera
    this.setupCamera();
    this.cameraItemSignal.set(this.cameraService.cameraItems);

  }

  updateRenderer(renderItem: RendererInterface): void
  {
    this.rendererItem = renderItem;
  }

  addLight(lightItem: LightInterface): LightInterface
  {
    /* 
      Sometimes a new light is added for changes (like changing from point light to spotlight)
      so a new light must be created for the scene, but the light item should NOT be re-added or
      there will be a duplicate.
    */
    const existingLight = this.lightItems.find( (light: LightInterface) => {
      return (light.id === lightItem.id)
    } );

    if (existingLight === undefined)
    {
      this.lightItems.push(lightItem);
    }
    
    this.lightItems = [... this.lightItems];
    let light;
    if(lightItem.lightType === "PointLight") {
      // create a new pointlight
      light = new THREE.PointLight();
    } else if (lightItem.lightType === "SpotLight") {
      // create a new spotlight
      light = new THREE.SpotLight();
    }
    const threeLight = light as SupportedLights;
    this.lights.push(threeLight);
    threeLight.intensity = lightItem.intensity.startValue;
    threeLight.position.setX(lightItem.xPos.startValue);
    threeLight.position.setY(lightItem.yPos.startValue);
    threeLight.position.setZ(lightItem.zPos.startValue);
    lightItem.id = threeLight.id;
    threeLight.castShadow = lightItem.castShadow;
    this.lightListSignal.set(this.lightItems);
    this.scenes[0].add( threeLight );

    return lightItem;
  }

  updateLight(lightItem: LightInterface): void
  {
    let light = this.lights.find( (light: PointLight | SpotLight) => {
      return (light.id === lightItem.id)
    } );

    if (light)
    {
      if (light.type !== lightItem.lightType) {
        lightItem.previousId = lightItem.id;
        let oldLight = this.lights.find( (light: SupportedLights) => {
          return (light.id === lightItem.id)
        } ) as SupportedLights;

        // remove from list
        this.lights = this.lights.filter((light) => light.id !== lightItem.id);
        // remove from scene
        this.scenes[0].remove(oldLight);

        this.addLight(lightItem);
        const newLight = this.lights.find( (light: SupportedLights) => {
          return (light.id === lightItem.id);
        } ) as SupportedLights;
        light = newLight;
        if (lightItem.animated) {
          this.animationService.updateLight(newLight);
        }

      }

      light.position.setX(lightItem.xPos.startValue);
      light.position.setY(lightItem.yPos.startValue);
      light.position.setZ(lightItem.zPos.startValue);
      light.intensity = lightItem.intensity.startValue;
      
      if (lightItem.lightType === 'SpotLight')
      {
        const spotLight = light as SpotLight; // this was assigning the passed in light which was the old light
        spotLight.angle = lightItem.angle;
        spotLight.penumbra = lightItem.penumbra;
        spotLight.decay = lightItem.decay;
        if (!lightItem.target?.id)
        {
          const lightTargetObject = new THREE.Object3D();
          spotLight.target = lightTargetObject;
          lightItem.target.id = spotLight.target.id;
          this.scenes[0].add(spotLight.target);
          lightItem.target.addedToScene = true;
        }

        spotLight.target.position.setX(lightItem.target.xPos); 
        spotLight.target.position.setY(lightItem.target.yPos); 
      }

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
    const light = this.lights.find( (light: PointLight | SpotLight) => {
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
    const mesh: SupportedMeshes = await this.meshService.addMesh(meshItem);
    //this.updateMesh(meshItem);  // I don't think that this is needed  
    this.meshListSignal.set(this.meshService.meshItems);
    this.scenes[0].add( mesh );

    this.animationService.setAnimationPairs(meshItem, mesh);
    this.animationPairSignal.set(this.animationService.animationsPairs);
    return meshItem;
  }

  async updateMesh(meshItem: MeshInterface): Promise<void>
  {
    const updateMesh = this.meshService.meshes.find((mesh) => mesh.id === meshItem.id);
  
    await this.meshService.updateMesh(meshItem);
    this.meshListSignal.set(this.meshService.meshItems);

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

  deleteMesh(id: number): void
  {
    const mesh = this.meshService.meshes.find( (mesh) => mesh.id === id);
    this.meshService.deleteMesh(id);

    if(mesh)
    {
      this.scenes[0].remove(mesh);
      this.meshService.meshItems = this.meshService.meshItems.filter((mesh) => mesh.id !== id);

      this.meshListSignal.set(this.meshService.meshItems);

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
        this.cameraService.cameras.forEach(
          (camera) => {
            const cameraItem:  CameraInterface | undefined = this.getCameraItemForId(camera.id);
            
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
        this.meshService.meshes.forEach(
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

      this.renderer.render( this.scenes[0], this.cameraService.cameras[0] );
    }

    return animation;
  }

  getMeshItemForId(meshId: number): MeshInterface | undefined
  {
    return this.meshService.meshItems.find(
      (mi: MeshInterface) => mi.id === meshId
    );

  }

  getLightItemForId(lightId: number): LightInterface | undefined
  {
    return this.lightItems.find(
      (li: LightInterface) => li.id === lightId
    );
  }

  getCameraItemForId(cameraId: number): CameraInterface | undefined
  {
    return this.cameraService.cameraItems.find(
      (camera: CameraInterface) => camera.id === cameraId
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

    this.meshService.meshes.forEach(
      (mesh) => {
        this.animationService.updateMeshForTime(mesh, this.getMeshItemForId(mesh.id), this.animationService.clock.elapsedTime, this.animationService.animationItem.time);
      }
    );

    this.lights.forEach(
      (light) => {
        this.animationService.updateLightForTime(light, this.getLightItemForId(light.id), this.animationService.clock.elapsedTime, this.animationService.animationItem.time);
      }
    );

    this.cameraService.cameras.forEach(
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