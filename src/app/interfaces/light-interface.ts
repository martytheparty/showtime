import { FormGroup } from "@angular/forms"
import { Subscription } from "rxjs"
import { AnimationPropertyDescriptor } from "./animations-interfaces"
import { PointLight } from "three"

export interface LightInterface {
    id: number
    name: string
    lightType: 'PointLight' | 'SpotLight'
    xPos: AnimationPropertyDescriptor
    yPos: AnimationPropertyDescriptor
    zPos: AnimationPropertyDescriptor
    redColor: number
    greenColor: number
    blueColor: number
    intensity: number
    castShadow: boolean
    form?: FormGroup
    sub?: Subscription
    animated: boolean
    type: 'light'
}

export type SupportedLights = PointLight;
