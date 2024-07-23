import { Scene } from "three"
import { CameraInterface, SupportedCameras } from "./camera-interfaces"
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
    item: MeshInterface | LightInterface | CameraInterface | SceneInterface,
    threeObj: SupportedMeshes | SupportedLights | SupportedCameras | Scene
}

export type AnimationInterfaceProperties = 'xPos' | 'yPos' | 'zPos' | 'xLookat' | 'yLookat' | 'zLookat' | 'redColor' | 'greenColor' | 'blueColor' | 'xRotation' | 'yRotation' | 'zRotation';
export type ThreeObjProperties = 'position' | 'lookAt' | 'background' | 'rotation';
export type ThreeObjSubProperties = 'x' | 'y' | 'z' | 'r' | 'g' | 'b';
export type SuportedThreeObjTypes = 'light' | 'mesh' | 'OrthographicCamera' | 'PerspectiveCamera' | 'Scene';
export type MappedSupportedPropertyTypes = { [key: string] : SuportedThreeObjTypes[] };

/*
this does not achieve the goal... the goal was to know 
which signal caused the effect to get executed... but 
knowing the signalType does not help... back to the drawing
board :)
*/
export type MappedSupportedPropertyTypesSignal = {
    supportedPropertyTypes: MappedSupportedPropertyTypes;
    signalType: 'MappedSupportedPropertyTypes';
};

export interface PropertyMenuItem {
    name: string
    itemValue: AnimationInterfaceProperties,
    threeProperty: ThreeObjProperties,
    threeSubProperty: ThreeObjSubProperties
  }