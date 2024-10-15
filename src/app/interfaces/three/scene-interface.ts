import { AnimationPropertyDescriptor } from "./animations-interfaces"

export interface SceneInterface {
    id: number;
    name: string;
    redColor: AnimationPropertyDescriptor;
    greenColor: AnimationPropertyDescriptor;
    blueColor: AnimationPropertyDescriptor;
    type: 'Scene';
    animated: boolean;
    fog: 'linear' | 'none' | 'exp2';
    redFogColor: number,
    greenFogColor: number,
    blueFogColor: number,
    fogDensity: number,
    near: number,
    far: number
}