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
    item: MeshInterface,
    threeObj: SupportedMeshes
}

export type AnimationInterfaceProperties = 'xPos' | 'yPos';
export type ThreeObjProperties = 'position';
export type ThreeObjSubProperties = 'x' | 'y';