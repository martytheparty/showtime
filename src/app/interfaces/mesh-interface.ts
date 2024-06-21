import { FormGroup } from "@angular/forms"
import { Subscription } from "rxjs"
import { BoxGeometry, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshPhongMaterial, Object3DEventMap, SphereGeometry } from "three"
import { AnimationPropertyDescriptor } from "./animations-interfaces"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"

export interface MeshInterface {
    id: number
    shape: 'BoxGeometry' | 'SphereGeometry' | 'TextGeometry'
    name: string
    xPos: AnimationPropertyDescriptor
    yPos: AnimationPropertyDescriptor
    zPos: AnimationPropertyDescriptor
    form?: FormGroup
    sub?: Subscription
    materialType: MaterialTypes
    redColor: number
    greenColor: number
    blueColor: number
    width: number
    height: number
    size: number
    bevelEnabled: boolean
    curveSegments: number
    bevelOffset: number
    bevelSegments: number
    bevelThickness: number
    bevelSize: number
    steps: number
    depth: number
    radius: number
    castShadow: boolean
    receiveShadow: boolean
    animated: boolean
    type: 'mesh'
    xRotation: AnimationPropertyDescriptor
    yRotation: AnimationPropertyDescriptor
    zRotation: AnimationPropertyDescriptor
}

export type MaterialTypes = 'basic' | 'phong' | 'normal'

export type SupportedMeshes = Mesh<BoxGeometry | SphereGeometry | TextGeometry, MeshNormalMaterial | MeshPhongMaterial | MeshBasicMaterial, Object3DEventMap>
