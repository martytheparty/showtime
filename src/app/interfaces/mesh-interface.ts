import { FormGroup } from "@angular/forms"
import { Subscription } from "rxjs"

export interface MeshInterface {
    id: number
    name: string
    xPos: number
    yPos: number
    zPos: number
    form?: FormGroup
    sub?: Subscription
    materialType: MaterialTypes
    redColor: number
    greenColor: number
    blueColor: number
}

export type MaterialTypes = 'basic' | 'phong' | 'normal'
