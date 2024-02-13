import { FormGroup } from "@angular/forms"
import { Subscription } from "rxjs"

export interface MeshInterface {
    id: number
    xPos: number
    yPos: number
    zPos: number
    form?: FormGroup
    sub?: Subscription
}
