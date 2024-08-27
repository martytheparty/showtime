import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { LightInterface, SupportedLights } from '../interfaces/light-interface';
import { SpotLight, PointLight } from 'three';

@Injectable({
  providedIn: 'root'
})
export class LightService {

  lights: SupportedLights[] = [];
  lightItems: LightInterface[] = [];

  constructor() { }

  addLight(lightItem: LightInterface): SupportedLights
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
 

    return threeLight;
  }

 
}
