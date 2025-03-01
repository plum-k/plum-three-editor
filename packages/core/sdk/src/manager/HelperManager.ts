import * as  THREE from "three";
import {Module, IModuleOptions } from "../core/Module";

export interface IHelperManagerOptions extends IModuleOptions  {

}

export class HelperManager extends Module {
    constructor(options: IHelperManagerOptions) {
        super(options);
    }

    addGridHelper(size: number, divisions: number) {
        const gridHelper = new THREE.GridHelper(size, divisions);
        this.viewer.scene.add(gridHelper);
    }

    addAxesHelper(size: number) {
        const axesHelper = new THREE.AxesHelper(size);
        this.viewer.scene.add(axesHelper);
    }

    addCameraHelper(camera: THREE.Camera = this.viewer.threeCameraControls.perspectiveCamera) {
        const cameraHelper = new THREE.CameraHelper(camera);
        this.viewer.scene.add(cameraHelper);
    }

    addSkeletonHelper(object: THREE.Object3D) {
        const skeletonHelper = new THREE.SkeletonHelper(object);
        this.viewer.scene.add(skeletonHelper)
    }

}