import { AnimationPropertyDescriptor } from "./animations-interfaces"

export interface SceneInterface {
    id: number;
    name: string;
    bgRedColor: AnimationPropertyDescriptor
    bgGreenColor: number
    bgBlueColor: number,
    type: 'Scene',
    animated: boolean
}