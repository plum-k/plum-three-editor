import {Component, IComponentOptions} from "../core/Component";

export interface IHelperManagerOptions extends IComponentOptions {

}

export class HelperManager extends Component {
    constructor(options: IHelperManagerOptions) {
        super(options);
    }

    addGridHelper(size: number, divisions: number) {
        const gridHelper = new GridHelper(size, divisions);
        this.viewer.scene.add(gridHelper);
    }

    addAxesHelper(size: number) {
        const axesHelper = new AxesHelper(size);
        this.viewer.scene.add(axesHelper);
    }

    addCameraHelper(camera: Camera = this.viewer.cameraManager.perspectiveCamera) {
        const cameraHelper = new CameraHelper(camera);
        this.viewer.scene.add(cameraHelper);
    }

    addSkeletonHelper(object: Object3D) {
        const skeletonHelper = new SkeletonHelper(object);
        this.viewer.scene.add(skeletonHelper)
    }

}