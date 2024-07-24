import { Injectable } from '@angular/core';
import { CameraInterface, SupportedCameras } from '../interfaces/camera-interfaces';

import * as THREE from 'three';
import { OrthographicCamera } from 'three';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

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

  constructor() { }
}
