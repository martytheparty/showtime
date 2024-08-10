import { Injectable } from '@angular/core';
import { MeshInterface, SupportedMeshes } from '../interfaces/mesh-interface';
import { SupportedLights, LightInterface } from '../interfaces/light-interface';
import * as THREE from 'three';
import { Scene } from 'three';
import { SceneInterface } from '../interfaces/scene-interface';
import { CameraInterface, SupportedCameras } from '../interfaces/camera-interfaces';
import { AnimationInterface, AnimationPair, MappedSupportedPropertyTypes, PropertyMenuItem } from '../interfaces/animations-interfaces';


@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  animationItem: AnimationInterface = {
    looping: true,
    running: true,
    time: 3,
    pause: false,
    pauseTime: 0
  };

  animationsPairs: AnimationPair[] = [];
  clock = new THREE.Clock();

  menuItems: PropertyMenuItem[] = [
    { name: 'X Position', itemValue: 'xPos', threeProperty: 'position', threeSubProperty: 'x' },
    { name: 'Y Position', itemValue: 'yPos', threeProperty: 'position', threeSubProperty: 'y' },
    { name: 'Z Position', itemValue: 'zPos', threeProperty: 'position', threeSubProperty: 'z' },
    { name: 'X LookAt', itemValue: 'xLookat', threeProperty: 'lookAt', threeSubProperty: 'x' },
    { name: 'Y LookAt', itemValue: 'yLookat', threeProperty: 'lookAt', threeSubProperty: 'y' },
    { name: 'Z LookAt', itemValue: 'zLookat', threeProperty: 'lookAt', threeSubProperty: 'z' },
    { name: 'X Rotation', itemValue: 'xRotation', threeProperty: 'rotation', threeSubProperty: 'x' },
    { name: 'Y Rotation', itemValue: 'yRotation', threeProperty: 'rotation', threeSubProperty: 'y' },
    { name: 'Z Rotation', itemValue: 'zRotation', threeProperty: 'rotation', threeSubProperty: 'z' },
    { name: 'Red', itemValue: 'redColor', threeProperty: 'background', threeSubProperty: 'r' },
    { name: 'Green', itemValue: 'greenColor', threeProperty: 'background', threeSubProperty: 'g' },
    { name: 'Blue', itemValue: 'blueColor', threeProperty: 'background', threeSubProperty: 'b' },
    { name: 'Intensity', itemValue: 'intensity', threeProperty: 'intensity', threeSubProperty: '' }
  ];

  supportedPropsDictionary: MappedSupportedPropertyTypes = {
    xPos: ['light', 'mesh', 'PerspectiveCamera', 'OrthographicCamera'],
    yPos: ['light', 'mesh', 'PerspectiveCamera', 'OrthographicCamera'],
    zPos: ['light', 'mesh', 'PerspectiveCamera', 'OrthographicCamera'],
    xLookat: ['PerspectiveCamera', 'OrthographicCamera'],
    yLookat: ['PerspectiveCamera', 'OrthographicCamera'],
    zLookat: ['PerspectiveCamera', 'OrthographicCamera'],
    xRotation: ['mesh'],
    yRotation: ['mesh'],
    zRotation: ['mesh'],
    redColor: ['Scene'],
    greenColor: ['Scene'],
    blueColor: ['Scene'],
    intensity: ['light']
  };

  constructor() { }

  updateLight(light: SupportedLights): void {
    const pair: AnimationPair = this.animationsPairs
                .find( (aniPair: AnimationPair) => {
                  return (aniPair.item.id === light.id)
                } ) as AnimationPair;

    pair.threeObj = light;
  }

  pruneAnimationPairs(): void {
    if (this.animationsPairs.length > 0) {
      // basically deleted any pairs that are not animated
      const pairs: AnimationPair[] = this.animationsPairs
        .filter((pair: AnimationPair | undefined) => (pair && pair.item.animated));

      this.animationsPairs = pairs;
    }
  }

  setAnimationPairs(item: MeshInterface | LightInterface | CameraInterface | SceneInterface, threeObj: SupportedMeshes | SupportedLights | SupportedCameras | Scene): void {
    const pair = this.animationsPairs
      .find((pair) => pair.item.id === item.id);
    if (item.animated && !pair) {
      const animationPair: AnimationPair = { item, threeObj };
      this.animationsPairs.push(animationPair);
      this.animationsPairs = [...this.animationsPairs];
    }
  }

  updateMeshForTime(
    mesh: SupportedMeshes,
    meshItem: MeshInterface | undefined,
    time: number,
    animationTime: number
  ): void {
    if (meshItem) {
      let xSpeed = 0;
      let ySpeed = 0;
      let zSpeed = 0;

      let xRotationSpeed = 0;
      let yRotationSpeed = 0;
      let zRotationSpeed = 0;

      if (meshItem.xPos.animated) {
        xSpeed = (meshItem.xPos.endValue * 1 - meshItem.xPos.startValue * 1) / animationTime;
      }

      if (meshItem.yPos.animated) {
        ySpeed = (meshItem.yPos.endValue * 1 - meshItem.yPos.startValue * 1) / animationTime;
      }

      if (meshItem.zPos.animated) {
        zSpeed = (meshItem.zPos.endValue * 1 - meshItem.zPos.startValue * 1) / animationTime;
      }

      if (meshItem.xRotation.animated) {
        xRotationSpeed = (meshItem.xRotation.endValue * 1 - meshItem.xRotation.startValue * 1) / animationTime;
      }

      if (meshItem.yRotation.animated) {
        yRotationSpeed = (meshItem.yRotation.endValue * 1 - meshItem.yRotation.startValue * 1) / animationTime;
      }

      if (meshItem.zRotation.animated) {
        zRotationSpeed = (meshItem.zRotation.endValue * 1 - meshItem.zRotation.startValue * 1) / animationTime;
      }

      mesh.position.setX(meshItem.xPos.startValue * 1 + xSpeed * time);
      mesh.position.setY(meshItem.yPos.startValue * 1 + ySpeed * time);
      mesh.position.setZ(meshItem.zPos.startValue * 1 + zSpeed * time);

      mesh.rotation.x =  meshItem.xRotation.startValue * 1 + xRotationSpeed * time;
      mesh.rotation.y =  meshItem.yRotation.startValue * 1 + yRotationSpeed * time;
      mesh.rotation.z =  meshItem.zRotation.startValue * 1 + zRotationSpeed * time;

    }
  }

  updateLightForTime(
    light: SupportedLights,
    lightItem: LightInterface | undefined,
    time: number,
    animationTime: number
  ): void {
    if (lightItem) {
      let xSpeed = 0;
      let ySpeed = 0;
      let zSpeed = 0;
      let intensitySpeed = 0;

      if (lightItem.xPos.animated) {
        xSpeed = (lightItem.xPos.endValue * 1 - lightItem.xPos.startValue * 1) / animationTime;
      }

      if (lightItem.yPos.animated) {
        ySpeed = (lightItem.yPos.endValue * 1 - lightItem.yPos.startValue * 1) / animationTime;
      }

      if (lightItem.zPos.animated) {
        zSpeed = (lightItem.zPos.endValue * 1 - lightItem.zPos.startValue * 1) / animationTime;
      }

      if (lightItem.intensity.animated) {
        intensitySpeed = (lightItem.intensity.endValue * 1 - lightItem.intensity.startValue * 1) / animationTime;
      }

      light.position.setX(lightItem.xPos.startValue * 1 + xSpeed * time);
      light.position.setY(lightItem.yPos.startValue * 1 + ySpeed * time);
      light.position.setZ(lightItem.zPos.startValue * 1 + zSpeed * time);
      light.intensity = lightItem.intensity.startValue * 1 + intensitySpeed * time;
    }
  }

  updateSceneForTime(
    scene: Scene,
    sceneItem: SceneInterface | undefined,
    time: number,
    animationTime: number
  ): void {
    if (sceneItem) {
      let redSpeed = 0;
      let greenSpeed = 0;
      let blueSpeed = 0;

      if (sceneItem.redColor.animated) {
        redSpeed = (sceneItem.redColor.endValue * 1 - sceneItem.redColor.startValue * 1) / animationTime;
      }

      if (sceneItem.greenColor.animated) {
        greenSpeed = (sceneItem.greenColor.endValue * 1 - sceneItem.greenColor.startValue * 1) / animationTime;
      }

      if (sceneItem.blueColor.animated) {
        blueSpeed = (sceneItem.blueColor.endValue * 1 - sceneItem.blueColor.startValue * 1) / animationTime;
      }

      scene.background = new THREE.Color()
        .setRGB(
          (sceneItem.redColor.startValue * 1 + redSpeed * time) / 255,
          (sceneItem.greenColor.startValue + greenSpeed * time) / 255,
          (sceneItem.blueColor.startValue + blueSpeed * time) / 255
        );

    }
  }

  updateCameraForTime(
    camera: SupportedCameras,
    cameraItem: CameraInterface | undefined,
    time: number,
    animationTime: number
  ): void {
    if (cameraItem) {
      let xSpeed = 0;
      let ySpeed = 0;
      let zSpeed = 0;
      let xLaSpeed = 0;
      let laXPosition = cameraItem.xLookat.startValue;
      let yLaSpeed = 0;
      let laYPosition = cameraItem.xLookat.startValue;
      let zLaSpeed = 0;
      let laZPosition = cameraItem.xLookat.startValue;

      if (cameraItem.xPos.animated) {
        xSpeed = (cameraItem.xPos.endValue * 1 - cameraItem.xPos.startValue * 1) / animationTime;
      }

      if (cameraItem.yPos.animated) {
        ySpeed = (cameraItem.yPos.endValue * 1 - cameraItem.yPos.startValue * 1) / animationTime;
      }

      if (cameraItem.zPos.animated) {
        zSpeed = (cameraItem.zPos.endValue * 1 - cameraItem.zPos.startValue * 1) / animationTime;
      }

      if (cameraItem.xLookat.animated) {
        xLaSpeed = (cameraItem.xLookat.endValue * 1 - cameraItem.xLookat.startValue * 1) / animationTime;
        laXPosition = cameraItem.xLookat.startValue * 1 + xLaSpeed * time;
      }

      if (cameraItem.yLookat.animated) {
        yLaSpeed = (cameraItem.yLookat.endValue * 1 - cameraItem.yLookat.startValue * 1) / animationTime;
        laYPosition = cameraItem.yLookat.startValue * 1 + yLaSpeed * time;
      }

      if (cameraItem.zLookat.animated) {
        zLaSpeed = (cameraItem.zLookat.endValue * 1 - cameraItem.zLookat.startValue * 1) / animationTime;
        laZPosition = cameraItem.zLookat.startValue * 1 + zLaSpeed * time;
      }

      camera.position.setX(cameraItem.xPos.startValue * 1 + xSpeed * time);
      camera.position.setY(cameraItem.yPos.startValue * 1 + ySpeed * time);
      camera.position.setZ(cameraItem.zPos.startValue * 1 + zSpeed * time);
      camera.lookAt(laXPosition, laYPosition, laZPosition);
      // when the current lookat is calculated this need to be updated
      cameraItem.lastXLookat = laXPosition;
      cameraItem.lastYLookat = laYPosition;
      cameraItem.lastZLookat = laZPosition;

    }
  }
}
