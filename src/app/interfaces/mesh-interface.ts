import { FormGroup } from "@angular/forms"
import { Subscription } from "rxjs"

export interface MeshInterface {
    id: number
    xPos: number
    form?: FormGroup
    sub?: Subscription
}
