import { Scene } from "three"
import { OrthographicCameraInterface, PerspectiveCameraInterface, SupportedCameras } from "./camera-interfaces"
import { LightInterface, SupportedLights } from "./light-interface"
import { MeshInterface, SupportedMeshes } from "./mesh-interface"
import { SceneInterface } from "./scene-interface"

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
    item: MeshInterface | LightInterface | PerspectiveCameraInterface | OrthographicCameraInterface | SceneInterface,
    threeObj: SupportedMeshes | SupportedLights | SupportedCameras | Scene
}

export type AnimationInterfaceProperties = 'xPos' | 'yPos' | 'zPos' | 'xLookat' | 'yLookat' | 'zLookat' | 'redColor' | 'greenColor';
export type ThreeObjProperties = 'position' | 'lookAt' | 'background';
export type ThreeObjSubProperties = 'x' | 'y' | 'z' | 'red' | 'green';
export type SuportedThreeObjTypes = 'light' | 'mesh' | 'OrthographicCamera' | 'PerspectiveCamera' | 'Scene';
export type MappedSupportedPropertyTypes = { [key: string] : SuportedThreeObjTypes[] };