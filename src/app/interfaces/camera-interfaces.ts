import { OrthographicCamera, PerspectiveCamera } from "three"

export interface PerspectiveCameraInterface {
    id: number
    name: string
    fov: number
    aspect: number
    near: number
    far: number
    xPos: number
    yPos: number
    zPos: number
    xLookat: number
    yLookat: number
    zLookat: number
    animated: boolean
    type: 'perspective-camera'
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
    xPos: number
    yPos: number
    zPos: number
    xLookat: number
    yLookat: number
    zLookat: number
    animated: boolean
    type: 'orthographic-camera'
}

export type CameraType = 'perspective' | 'orthographic';

export type SupportedCameras = PerspectiveCamera | OrthographicCamera;