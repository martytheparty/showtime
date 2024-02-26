export interface PerspectiveCameraInterface {
    fov: number
    aspect: number
    near: number
    far: number
    xPos: number
    yPos: number
    zPos: number
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
}

export type CameraType = 'perspective' | 'orthographic';