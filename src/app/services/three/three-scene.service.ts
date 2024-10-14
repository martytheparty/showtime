import { Injectable, inject } from '@angular/core';
import * as THREE from 'three';
import { Scene } from 'three';
import { SceneInterface } from '../../interfaces/scene-interface';
import { MathService } from '../utils/math.service';
@Injectable({
  providedIn: 'root'
})
export class ThreeSceneService {

  private mathService: MathService = inject(MathService);

  private scenes: Scene[] = [new THREE.Scene()];

  constructor() { }

  getScene(): Scene
  {
    return this.scenes[0];
  }

  getScenes(): Scene[]
  {
    return this.scenes;
  }

  setUpScene(sceneItem: SceneInterface ): number
  {
    const scene = this.scenes[0];
    scene.background = new THREE.Color()
                            .setRGB(
                              sceneItem.redColor.startValue/255,
                              sceneItem.greenColor.startValue/255,
                              sceneItem.blueColor.startValue/255
                            );

    if (sceneItem.fog === 'none')
    {
      // set the fog to null
      scene.fog = null;
    } else {
      const fogHexColor = this.mathService.rgbToHex(sceneItem.redFogColor, sceneItem.greenFogColor, sceneItem.blueFogColor);
      
      if (sceneItem.fog === 'exp2') {
        // set fog to exp2
        scene.fog = new THREE.FogExp2(fogHexColor, sceneItem.fogDensity)
      } else if (sceneItem.fog === 'linear') {
        scene.fog = new THREE.Fog(fogHexColor, sceneItem.near, sceneItem.far)
        // set fog to linear
      }
    }

    return this.scenes[0].id;
  }
}
