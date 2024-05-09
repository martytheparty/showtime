import { OrthographicCameraInterface, PerspectiveCameraInterface, SupportedCameras } from "./camera-interfaces"
import { LightInterface, SupportedLights } from "./light-interface"
import { MeshInterface, SupportedMeshes } from "./mesh-interface"

export interface AnimationInterface {
    running: boolean
    looping: boolean
    time: number // how long a loop is for
    pause: boolean
    pauseTime: number
}

export interface AnimationPropertyDescriptor {
    startValue: number
    endValue: number
    animated: boolean
}

export interface AnimationPair {
    item: MeshInterface | LightInterface | PerspectiveCameraInterface | OrthographicCameraInterface,
    threeObj: SupportedMeshes | SupportedLights | SupportedCameras
}

export type AnimationInterfaceProperties = 'xPos' | 'yPos' | 'zPos' | 'xLookat' | 'yLookat' | 'zLookat';
export type ThreeObjProperties = 'position' | 'lookAt';
export type ThreeObjSubProperties = 'x' | 'y' | 'z';
export type SuportedThreeObjTypes = 'light' | 'mesh' | 'OrthographicCamera' | 'PerspectiveCamera';
export type MappedSupportedPropertyTypes = { [key: string] : SuportedThreeObjTypes[] };