import { FormGroup } from "@angular/forms"
import { Subscription } from "rxjs"
import { BoxGeometry, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshPhongMaterial, Object3DEventMap, SphereGeometry } from "three"

export interface MeshInterface {
    id: number
    shape: 'BoxGeometry' | 'SphereGeometry'
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
    width: number
    height: number
    depth: number
    radius: number
    castShadow: boolean
    receiveShadow: boolean
}

export type MaterialTypes = 'basic' | 'phong' | 'normal'

export type SupportedMeshes = Mesh<BoxGeometry | SphereGeometry, MeshNormalMaterial | MeshPhongMaterial | MeshBasicMaterial, Object3DEventMap>
