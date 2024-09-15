import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Scene } from 'three';
import { SceneInterface } from '../../interfaces/scene-interface';


@Injectable({
  providedIn: 'root'
})
export class ThreeSceneService {

  scenes: Scene[] = [new THREE.Scene()];

  constructor() { }

  setUpScene(sceneItem: SceneInterface ): number
  {
    this.scenes[0].background = new THREE.Color()
                            .setRGB(
                              sceneItem.redColor.startValue/255,
                              sceneItem.greenColor.startValue/255,
                              sceneItem.blueColor.startValue/255
                            );
    return this.scenes[0].id;
  }
}
