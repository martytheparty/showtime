import { FormGroup } from "@angular/forms"
import { Subscription } from "rxjs"

export interface LightInterface {
    id: number
    name?: string
    xPos: number
    yPos: number
    zPos: number
    form?: FormGroup
    sub?: Subscription
}
