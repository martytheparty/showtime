import * as THREE from 'three';
import { Injectable, inject } from '@angular/core';
import { LightInterface, SupportedLights } from '../interfaces/three/light-interface';
import { SpotLight, PointLight } from 'three';
import { RecyclableSequenceService } from './utils/recyclable-sequence-service.service';

@Injectable({
  providedIn: 'root'
})
export class LightService {
  private recyclableSequenceService: RecyclableSequenceService = inject(RecyclableSequenceService);
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
      lightItem.stId = this.recyclableSequenceService.generateId();
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

  updateLight(lightItem: LightInterface): void
  {

    let light = this.lights.find( (light: PointLight | SpotLight) => {
      return (light.id === lightItem.id)
    } ) as SupportedLights;

    light.position.setX(lightItem.xPos.startValue);
    light.position.setY(lightItem.yPos.startValue);
    light.position.setZ(lightItem.zPos.startValue);
    light.intensity = lightItem.intensity.startValue;

    if (lightItem.lightType === 'SpotLight')
      {
        const spotLight = light as SpotLight; // this was assigning the passed in light which was the old light
        // target code should be replaced by future grouping code
        
        spotLight.angle = lightItem.angle;
        spotLight.penumbra = lightItem.penumbra;
        spotLight.decay = lightItem.decay;
        spotLight.target.position.setX(lightItem.target.xPos); 
        spotLight.target.position.setY(lightItem.target.yPos); 
        spotLight.target.position.setZ(lightItem.target.zPos); 
      }


    if (lightItem.name)
      {
        light.name = lightItem.name;
      }
      light.color.setRGB(lightItem.redColor/255,lightItem.greenColor/255,lightItem.blueColor/255);
      light.castShadow = lightItem.castShadow;
  }

  getThreeJsLight(id: number): SupportedLights
  {
    return this.lights.find( (light: SupportedLights) => {
      return (light.id === id)
    } ) as SupportedLights;
  }

  deleteThreeJsLight(id: number): void
  {
    this.lights = this.lights.filter((light) => light.id !== id);
  }

  deleteLight(lightItem: LightInterface): void
  {
    let light = this.getThreeJsLight(lightItem.id);
    this.recyclableSequenceService.recycleId(lightItem.stId);

    if(light)
    {
      this.deleteThreeJsLight(lightItem.id);
      this.lightItems = this.lightItems.filter((light) => light.id !== lightItem.id);
    }

  }

 
}
