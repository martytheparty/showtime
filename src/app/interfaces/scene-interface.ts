import { AnimationPropertyDescriptor } from "./animations-interfaces"

export interface SceneInterface {
    id: number;
    name: string;
    redColor: AnimationPropertyDescriptor;
    greenColor: AnimationPropertyDescriptor;
    blueColor: AnimationPropertyDescriptor;
    type: 'Scene';
    animated: boolean;
}