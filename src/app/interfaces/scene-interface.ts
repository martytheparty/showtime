import { AnimationPropertyDescriptor } from "./animations-interfaces"

export interface SceneInterface {
    id: number;
    name: string;
    redColor: AnimationPropertyDescriptor;
    greenColor: AnimationPropertyDescriptor;
    bgBlueColor: number;
    type: 'Scene';
    animated: boolean;
}