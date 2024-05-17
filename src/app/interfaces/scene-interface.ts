import { AnimationPropertyDescriptor } from "./animations-interfaces"

export interface SceneInterface {
    id: number;
    name: string;
    redColor: AnimationPropertyDescriptor
    bgGreenColor: number
    bgBlueColor: number,
    type: 'Scene',
    animated: boolean
}