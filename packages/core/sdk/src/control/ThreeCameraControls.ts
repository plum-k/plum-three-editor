import * as THREE from 'three';
import {PerspectiveCamera} from 'three';

import CameraControls from "camera-controls";
import {Viewer} from "../core/Viewer";
import {OrthographicCamera} from "three/src/cameras/OrthographicCamera";
import {deepMergeRetain} from "../tool";

// 安装camera-controls扩展，使其支持THREE库
CameraControls.install({THREE: THREE});

/**
 * 交互控制类，用于管理Three.js场景中的摄像机控制。
 */
export interface IThreeCameraControls {
    viewer: Viewer;
}

/**
 * ThreeCameraControls类负责初始化和管理Three.js的摄像机控制。
 * 它通过与viewer实例配合，提供交互式摄像机控制功能。
 */
export class ThreeCameraControls {
    options: any;
    viewer: Viewer
    perspectiveCamera: PerspectiveCamera | OrthographicCamera;
    cameraControls: CameraControls;
    width: number;
    height: number;

    /**
     * 构造函数初始化ThreeCameraControls实例。
     * @param options - 包含viewer实例的选项对象。
     */
    constructor(options: IThreeCameraControls) {
        this.options = deepMergeRetain(options, {})
        this.viewer = this.options.viewer

        // 从viewer获取默认WebGL渲染器和视图尺寸
        let defaultWebGLRenderer = this.viewer.renderManager.defaultWebGLRenderer;
        let {width, height} = this.viewer.getSize();

        // 根据视图尺寸初始化摄像机和相机控制
        this.width = width;
        this.height = height;
        // todo
        this.perspectiveCamera = new THREE.PerspectiveCamera(60, width / height, 0.01, 18000);
        this.cameraControls = new CameraControls(this.perspectiveCamera, defaultWebGLRenderer.domElement);


        this.cameraControls.maxDistance = 99999;
        this.cameraControls.minDistance = -99999;
    }

    get camera() {
        return this.perspectiveCamera;
    }

    /**
     * 设置视图尺寸，并相应地调整摄像机的方面比例。
     * @param width - 视图宽度。
     * @param height - 视图高度。
     * @param updateStyle - 是否更新DOM元素的样式（可选）。
     */
    setSize(width: number, height: number, updateStyle?: boolean) {
        this.width = width;
        this.height = height;
        const aspect = width / height;
        this.perspectiveCamera.aspect = aspect;
        this.perspectiveCamera.updateProjectionMatrix();
    }

}
