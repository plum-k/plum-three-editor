import * as  THREE from "three";
import BasePlum, {IBasePlumOptions} from "../core/BasePlum";

export interface IHelperManagerOptions extends IBasePlumOptions {

}

export default class HelperManager extends BasePlum {
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