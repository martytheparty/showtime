import { Injectable } from '@angular/core';

import * as THREE from 'three';
import { Scene } from 'three';
import { SceneInterface } from '../interfaces/scene-interface';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  scenes: Scene[] = [new THREE.Scene()];
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

  constructor() { }

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

    this.setUpScene();
  }

}
