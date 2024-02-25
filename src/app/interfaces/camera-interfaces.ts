export interface PerspectiveCameraInterface {
    fov: number
    aspect: number
    near: number
    far: number
    xPos: number
    yPos: number
    zPos: number
}

export interface OrthographicInterface {
    left: number
    right: number
    top: number
    bottom: number
    new: number
    far: number
}