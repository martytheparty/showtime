import { FormGroup } from "@angular/forms"
import { Subscription } from "rxjs"

export interface LightInterface {
    id: number
    name?: string
    xPos: number
    yPos: number
    zPos: number
    redColor: number
    greenColor: number
    blueColor: number
    intensity: number
    form?: FormGroup
    sub?: Subscription
}
