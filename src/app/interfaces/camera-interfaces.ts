import { OrthographicCamera, PerspectiveCamera } from "three"
import { AnimationPropertyDescriptor } from "./animations-interfaces"

export interface PerspectiveCameraInterface {
    id: number
    name: string
    fov: number
    aspect: number
    near: number
    far: number
    xPos: AnimationPropertyDescriptor
    yPos: AnimationPropertyDescriptor
    zPos: number
    xLookat: number
    yLookat: number
    zLookat: number
    animated: boolean
    type: 'PerspectiveCamera'
}

export interface OrthographicCameraInterface {
    id: number
    name: string
    left: number
    right: number
    top: number
    bottom: number
    near: number
    far: number
    xPos: AnimationPropertyDescriptor
    yPos: AnimationPropertyDescriptor
    zPos: number
    xLookat: number
    yLookat: number
    zLookat: number
    animated: boolean
    type: 'OrthographicCamera'
}

export type CameraType = 'PerspectiveCamera' | 'OrthographicCamera';

export type SupportedCameras = PerspectiveCamera | OrthographicCamera;
export type SupportedCameraItems = PerspectiveCameraInterface | OrthographicCameraInterface;