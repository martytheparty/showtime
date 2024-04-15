import { FormGroup } from "@angular/forms"
import { Subscription } from "rxjs"
import { AnimationPropertyDescriptor } from "./animations-interfaces"
import { PointLight } from "three"

export interface LightInterface {
    id: number
    name: string
    xPos: AnimationPropertyDescriptor
    yPos: number
    zPos: number
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
