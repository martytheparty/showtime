import { FormGroup } from "@angular/forms"
import { Subscription } from "rxjs"
import { AnimationPropertyDescriptor } from "./animations-interfaces"
import { PointLight, SpotLight } from "three"

export interface LightInterface {
    id: number
    stId: number
    name: string
    lightType: LightTypes
    xPos: AnimationPropertyDescriptor
    yPos: AnimationPropertyDescriptor
    zPos: AnimationPropertyDescriptor
    redColor: number
    greenColor: number
    blueColor: number
    intensity: AnimationPropertyDescriptor
    castShadow: boolean
    animated: boolean
    type: 'light'
    previousId: number
    angle: number,
    penumbra: number,
    decay: number,
    target: TargetObject, // high interest tech debt should be removed when grouping is implemented
}

export interface TargetObject {
    xPos: number,
    yPos: number,
    zPos: number,
    id?: number,
    addedToScene: boolean
}

export type SupportedLights = PointLight | SpotLight;

export type LightTypes = 'PointLight' | 'SpotLight';
