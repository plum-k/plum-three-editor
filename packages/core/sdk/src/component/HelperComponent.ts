import {AxesHelper, Camera, CameraHelper, GridHelper, Object3D, SkeletonHelper} from "three";
import {Component, IComponentOptions} from "./Component";

export interface IHelperComponentOptions extends IComponentOptions {

}

export class HelperComponent extends Component {
    constructor(options: IHelperComponentOptions) {
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

    addCameraHelper(camera: Camera = this.viewer.cameraComponent.perspectiveCamera) {
        const cameraHelper = new CameraHelper(camera);
        this.viewer.scene.add(cameraHelper);
    }

    addSkeletonHelper(object: Object3D) {
        const skeletonHelper = new SkeletonHelper(object);
        this.viewer.scene.add(skeletonHelper)
    }

}