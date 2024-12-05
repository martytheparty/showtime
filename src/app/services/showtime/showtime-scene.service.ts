import { Injectable, inject } from '@angular/core';
import { SceneInterface } from '../../interfaces/three/scene-interface';
@Injectable({
  providedIn: 'root'
})
export class ShowtimeSceneService {

  private sceneItem: SceneInterface = {
    id: -1,
    name: 'Scene',
    redColor: {startValue: 0, endValue: 0, animated: true},
    greenColor: {startValue: 0, endValue: 0, animated: true},
    blueColor: {startValue: 0, endValue: 0, animated: true},
    type: 'Scene',
    animated: false,
    fog: 'none',
    redFogColor: 100,
    greenFogColor: 100,
    blueFogColor: 100,
    fogDensity: .1,
    near: 1,
    far: 10
  };

  private sceneItems: SceneInterface[] = [this.sceneItem];

  constructor() { }

  getScene() {
    return this.sceneItems[0];
  }

  getScenes() {
    return this.sceneItems;
  }

  updateScene(sceneItem: SceneInterface): void
  {
    this.sceneItem = { ...sceneItem }; // shallow clone
    this.sceneItems[0] = this.sceneItem;
  }

}
