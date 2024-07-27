import { Injectable } from '@angular/core';
import { CameraInterface, CameraType, SupportedCameras } from '../interfaces/camera-interfaces';

import * as THREE from 'three';
import { OrthographicCamera, PerspectiveCamera } from 'three';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  cameraType: CameraType = 'PerspectiveCamera';

  cameras: SupportedCameras[] = [new THREE.PerspectiveCamera()];

  cameraItem: CameraInterface = {
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
  cameraItems: CameraInterface[] = [this.cameraItem];

  orthographicCamera: OrthographicCamera = new THREE.OrthographicCamera();
  orthographicCameraItem: CameraInterface = {
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
      this.cameraItems = [this.orthographicCameraItem];
    }
  }

  updateCamera(): void
  {
    if (this.cameraType === this.cameras[0].type)
    {
      const currentCamera = this.cameras[0];
      let xPos = 0;
      let yPos = 0;
      let zPos = 0;
      let far = 0;
      let near = 0;
      if (this.cameraType === 'PerspectiveCamera')
        {
          const camera: PerspectiveCamera = this.cameras[0] as PerspectiveCamera;
          // orthagraphic camera does not have these four that's why they need to be separate.
          if (this.cameraItem.fov)
          {
            camera.fov = this.cameraItem.fov;
          }
          
          if (this.cameraItem.aspect) {
            camera.aspect = this.cameraItem.aspect;
          }
          near = this.cameraItem.near;
          far = this.cameraItem.far;
          xPos = this.cameraItem.xPos.startValue;
          yPos = this.cameraItem.yPos.startValue;
          zPos = this.cameraItem.zPos.startValue;
          this.cameraItems = [this.cameraItem];
        } else {
          const camera: OrthographicCamera = this.cameras[0] as OrthographicCamera;
          if (this.orthographicCameraItem.left) {
            camera.left = this.orthographicCameraItem.left;
          }

          if (this.orthographicCameraItem.right) {
            camera.right = this.orthographicCameraItem.right;
          }

          if (this.orthographicCameraItem.top) {
            camera.top = this.orthographicCameraItem.top;
          }

          if (this.orthographicCameraItem.bottom) {
            camera.bottom = this.orthographicCameraItem.bottom;
          }

          near = this.orthographicCameraItem.near;
          far = this.orthographicCameraItem.far;
          xPos = this.orthographicCameraItem.xPos.startValue;
          yPos = this.orthographicCameraItem.yPos.startValue;
          zPos = this.orthographicCameraItem.zPos.startValue;   
          this.cameraItems = [this.orthographicCameraItem];
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

  }

  constructor() { }
  
}
