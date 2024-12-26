import { 
    BoxGeometry,
    CircleGeometry,
    ConeGeometry,
    Mesh,
    MeshBasicMaterial,
    MeshNormalMaterial,
    MeshPhongMaterial,
    Object3DEventMap,
    PlaneGeometry,
    SphereGeometry,
    DodecahedronGeometry,
    TetrahedronGeometry,
    OctahedronGeometry,
    IcosahedronGeometry
} from "three"
import { AnimationPropertyDescriptor } from "./animations-interfaces"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
import { Font } from "three/examples/jsm/loaders/FontLoader"

export interface MeshInterface {
    id: number
    shape: 'BoxGeometry'
    | 'SphereGeometry'
    | 'TextGeometry'
    | 'ConeGeometry'
    | 'PlaneGeometry'
    | 'CircleGeometry'
    | 'DodecahedronGeometry'
    | 'TetrahedronGeometry'
    | 'OctahedronGeometry'
    | 'IcosahedronGeometry'
    name: string
    xPos: AnimationPropertyDescriptor
    yPos: AnimationPropertyDescriptor
    zPos: AnimationPropertyDescriptor
    materialType: MaterialTypes
    redColor: number
    greenColor: number
    blueColor: number
    width: number
    height: number
    size: number
    text: string
    textOrig: string // used to determine if the text has changed
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
    font: FontName
}

export interface FontInterface {
    name: FontName
    promise: Promise<Font>
    font?: Font
}

export type FontName = 'Helvetiker' | 'Helvetiker Bold' | 'Gentilis' | 'Gentilis Bold'| 'Optimer' | 'Optimer Bold' | 'Droid Sans Bold' | 'Droid Sans Mono' | 'Droid Sans' | 'Droid Serif Bold' | 'Droid Serif';

export type MaterialTypes = 'basic' | 'phong' | 'normal'

export type SupportedMeshes = Mesh<
    PlaneGeometry
    | CircleGeometry
    | BoxGeometry
    | SphereGeometry
    | ConeGeometry
    | TextGeometry
    | DodecahedronGeometry
    | OctahedronGeometry
    | IcosahedronGeometry,
    MeshNormalMaterial
    | MeshPhongMaterial
    | MeshBasicMaterial
    , Object3DEventMap>
