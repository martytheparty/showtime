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
    zPos: AnimationPropertyDescriptor
    xLookat: AnimationPropertyDescriptor
    lastXLookat?: number
    yLookat: AnimationPropertyDescriptor
    lastYLookat?: number
    zLookat: AnimationPropertyDescriptor
    lastZLookat?: number
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
    zPos: AnimationPropertyDescriptor
    xLookat: AnimationPropertyDescriptor
    lastXLookat?: number
    yLookat: AnimationPropertyDescriptor
    lastYLookat?: number
    zLookat: AnimationPropertyDescriptor
    lastZLookat?: number
    animated: boolean
    type: 'OrthographicCamera'
}

export type CameraType = 'PerspectiveCamera' | 'OrthographicCamera';

export type SupportedCameras = PerspectiveCamera | OrthographicCamera;
export type SupportedCameraItems = PerspectiveCameraInterface | OrthographicCameraInterface;