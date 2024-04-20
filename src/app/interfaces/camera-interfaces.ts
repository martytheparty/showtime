import { OrthographicCamera, PerspectiveCamera } from "three"

export interface PerspectiveCameraInterface {
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
    type: 'perspective-camera'
}

export interface OrthographicCameraInterface {
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
    type: 'orthographic-camera'
}

export type CameraType = 'perspective' | 'orthographic';

export type SupportedCameras = PerspectiveCamera | OrthographicCamera;