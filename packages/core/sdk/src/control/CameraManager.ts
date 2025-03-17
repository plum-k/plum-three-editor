import * as THREE from 'three';
import {Object3D, OrthographicCamera, PerspectiveCamera} from 'three';
import CameraControls from "camera-controls";
import {Viewer} from "../core/Viewer";
import {deepMergeRetain, Tool} from "../tool";
import {Serialize} from "../serializeManage";
import {Asset} from "../manager/asset";

// 安装camera-controls扩展，使其支持THREE库
CameraControls.install({THREE: THREE});

/**
 * 交互控制类，用于管理Three.js场景中的摄像机控制。
 */
export interface IcameraManager {
    viewer: Viewer;
}

export enum ECameraViewType {
    PerspectiveView = "PerspectiveView",        //
    Top = "top",        // 顶视图
    Bottom = "bottom",  // 底视图
    Left = "left",      // 左视图
    Right = "right",    // 右视图
    Back = "back",      // 后视图
    Front = "front",    // 前视图
}

export enum ECameraType {
    PerspectiveCamera = "PerspectiveCamera",
    OrthographicCamera = "OrthographicCamera",
}

const DEG90 = Math.PI * 0.5;
const DEG180 = Math.PI;

/**
 * cameraManager类负责初始化和管理Three.js的摄像机控制。
 * 它通过与viewer实例配合，提供交互式摄像机控制功能。
 */
export class CameraManager {
    options: IcameraManager;
    viewer: Viewer;
    cameraType: ECameraType = ECameraType.PerspectiveCamera;
    perspectiveCamera: PerspectiveCamera;
    orthographicCamera: OrthographicCamera;
    perspectiveCameraControls: CameraControls;
    orthographicCameraControls: CameraControls;
    width: number;
    height: number;

    /**
     * 构造函数初始化cameraManager实例。
     * @param options - 包含viewer实例的选项对象。
     */
    constructor(options: IcameraManager) {
        this.options = deepMergeRetain(options, {})
        this.viewer = this.options.viewer

        // 从viewer获取默认WebGL渲染器和视图尺寸
        let defaultWebGLRenderer = this.viewer.renderManager.defaultWebGLRenderer;
        let {width, height} = this.viewer.getSize();

        this.width = width;
        this.height = height;

        this.perspectiveCamera = new THREE.PerspectiveCamera(60, width / height, 0.01, 18000);
        this.perspectiveCameraControls = new CameraControls(this.perspectiveCamera, defaultWebGLRenderer.domElement);

        this.orthographicCamera = new OrthographicCamera(
            width / -2,
            width / 2,
            height / 2,
            height / -2,
            0.01,
            18000
        );

        this.orthographicCameraControls = new CameraControls(this.orthographicCamera, defaultWebGLRenderer.domElement);

        this.cameraControls.maxDistance = 99999;
        this.cameraControls.minDistance = -99999;
        window.test11 = () => {
            this.toJSON();
        }
        // 避免相机位置 和 目标位置 重合
        this.cameraControls.setPosition(5, 5, 5).then();
        this.cameraControls.setTarget(0, 0, 0).then();
    }

    toJSON() {
        const perspectiveCameraControlsJson = JSON.parse(this.perspectiveCameraControls.toJSON());
        const perspectiveCameraJson = this.perspectiveCamera.toJSON();
        console.log(perspectiveCameraControlsJson);
        console.log(perspectiveCameraJson);

        return {
            perspectiveCameraControls: perspectiveCameraControlsJson,
            perspectiveCamera: perspectiveCameraJson,
        }
    }

    /**
     * 还原控制器
     */
    async fromJSON(json: Serialize.CameraManagerJson) {
        const asset = new Asset({
            result: json.perspectiveCamera,
            extension: "object"
        })
        const object = await this.viewer.assetManager.loadObject(asset) as THREE.PerspectiveCamera;
        this.perspectiveCameraControls.camera.copy(object);
        this.perspectiveCameraControls.fromJSON(JSON.stringify(json.perspectiveCameraControls),false);
    }

    test() {
        console.log(JSON.parse(this.cameraControls.toJSON()));
        console.log("azimuthAngle", THREE.MathUtils.radToDeg(this.cameraControls.azimuthAngle));
        console.log("polarAngle", THREE.MathUtils.radToDeg(this.cameraControls.polarAngle));
    }

    get cameraControls() {
        return this.cameraType === ECameraType.PerspectiveCamera ? this.perspectiveCameraControls : this.orthographicCameraControls;
    }

    get target() {
        return this.cameraControls.getTarget(new THREE.Vector3());
    }

    get position() {
        return this.cameraControls.getPosition(new THREE.Vector3());
    }

    get camera() {
        return this.cameraType === ECameraType.PerspectiveCamera ? this.perspectiveCamera : this.orthographicCamera;
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
        this.perspectiveCamera.aspect = width / height;
        this.perspectiveCamera.updateProjectionMatrix();

        this.orthographicCamera.left = -width / 2;
        this.orthographicCamera.right = width / 2
        this.orthographicCamera.top = height / 2;
        this.orthographicCamera.bottom = -height / 2;
        this.orthographicCamera.updateProjectionMatrix();
    }

    /**
     * 设置不同的视图模式
     * @param cameraViewType
     */
    setCameraViewType(cameraViewType: ECameraViewType) {
        switch (cameraViewType) {
            case ECameraViewType.PerspectiveView:
                this.setPerspectiveView();
                break;
            case ECameraViewType.Top:
                this.resetViewLimits();
                this.setTopView();
                break;
            case ECameraViewType.Bottom:
                this.resetViewLimits();
                this.setBottomView();
                break;
            case ECameraViewType.Left:
                this.resetViewLimits();
                this.setLeftView();
                break;
            case ECameraViewType.Right:
                this.resetViewLimits();
                this.setRightView();
                break;
            case ECameraViewType.Back:
                this.resetViewLimits();
                this.setBackView();
                break;
            case ECameraViewType.Front:
                this.resetViewLimits();
                this.setFrontView();
                break;
            default:
                throw new Error(`未知的视图类型: ${cameraViewType}`);
        }
    }

    /**
     * 重置视图限制
     */
    resetViewLimits() {
        this.cameraControls.minAzimuthAngle = -Infinity;
        this.cameraControls.maxAzimuthAngle = Infinity;
        this.cameraControls.minPolarAngle = -Infinity;
        this.cameraControls.maxPolarAngle = Infinity;
    }

    /**
     * 设置透视视图
     */
    setPerspectiveView() {
        this.resetViewLimits();
    }

    /**
     * 设置顶视图
     */
    setTopView() {
        this.cameraControls.rotateTo(0, 0, false).then();
        this.cameraControls.minAzimuthAngle = 0
        this.cameraControls.maxAzimuthAngle = 0
        this.cameraControls.minPolarAngle = 0;
        this.cameraControls.maxPolarAngle = 0;
    }

    /**
     * 设置底视图
     */
    setBottomView() {
        this.cameraControls.rotateTo(0, DEG180, false).then();
        this.cameraControls.minAzimuthAngle = 0
        this.cameraControls.maxAzimuthAngle = 0;
        this.cameraControls.minPolarAngle = DEG180;
        this.cameraControls.maxPolarAngle = DEG180;
    }


    /**
     * 设置左视图
     */
    setLeftView() {
        this.cameraControls.rotateTo(-DEG90, DEG90, false).then();
        this.cameraControls.minAzimuthAngle = -DEG90;
        this.cameraControls.maxAzimuthAngle = -DEG90;
        this.cameraControls.minPolarAngle = DEG90;
        this.cameraControls.maxPolarAngle = DEG90;
    }

    /**
     * 设置右视图
     */
    setRightView() {
        this.cameraControls.rotateTo(DEG90, DEG90, false).then();
        this.cameraControls.minAzimuthAngle = DEG90;
        this.cameraControls.maxAzimuthAngle = DEG90;
        this.cameraControls.minPolarAngle = DEG90;
        this.cameraControls.maxPolarAngle = DEG90;
    }

    /**
     * 设置后视图
     */
    setBackView() {
        this.cameraControls.rotateTo(DEG180, DEG90, false).then();
        this.cameraControls.minAzimuthAngle = DEG180;
        this.cameraControls.maxAzimuthAngle = DEG180;
        this.cameraControls.minPolarAngle = DEG90;
        this.cameraControls.maxPolarAngle = DEG90;
    }

    /**
     * 设置前视图
     */
    setFrontView() {
        this.cameraControls.rotateTo(0, DEG90, false).then();
        // 左右
        this.cameraControls.minAzimuthAngle = 0;
        this.cameraControls.maxAzimuthAngle = 0;
        // 上下
        this.cameraControls.minPolarAngle = DEG90;
        this.cameraControls.maxPolarAngle = DEG90;
    }

    /**
     * 同步控制器属性
     */
    syncView() {
        const targetControls = this.cameraType === ECameraType.PerspectiveCamera ? this.orthographicCameraControls : this.perspectiveCameraControls;
        targetControls.minAzimuthAngle = this.cameraControls.minAzimuthAngle
        targetControls.maxAzimuthAngle = this.cameraControls.maxAzimuthAngle
        targetControls.minPolarAngle = this.cameraControls.minPolarAngle
        targetControls.maxPolarAngle = this.cameraControls.maxPolarAngle
    }

    /**
     * 设置视图类型
     * @param type
     */
    setCameraType(type: ECameraType = ECameraType.PerspectiveCamera) {
        if (this.cameraType === type) return this;
        const target = this.target;
        const position = this.position;
        this.syncView();
        // 切换到透视
        if (type === ECameraType.PerspectiveCamera) {
            this.perspectiveCameraControls.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, false).then();
        } else if (type === ECameraType.OrthographicCamera) {
            // https://stackoverflow.com/questions/48187416/how-to-switch-between-perspective-and-orthographic-cameras-keeping-size-of-desir
            const fov = this.perspectiveCamera.fov;
            const far = this.perspectiveCamera.far;
            const depth = Math.tan(fov / 2.0 * DEG180 / 180.0) * 2.0;
            const z = position.distanceTo(target);
            const y = depth * z;
            const x = y * this.perspectiveCamera.aspect;

            this.orthographicCamera.left = -x / 2;
            this.orthographicCamera.right = x / 2
            this.orthographicCamera.top = y / 2;
            this.orthographicCamera.bottom = -y / 2;
            this.orthographicCamera.zoom = 1;
            this.orthographicCameraControls.setLookAt(position.x, position.y, position.z,
                target.x, target.y, target.z, false).then();
        }
        this.cameraType = type;
    }

    //--------------------- 聚焦相关-----------------------
    // 聚焦到场景
    async fitToSceneByBox(enableTransition: boolean = true) {
        const boundingBox = Tool.getSceneBox(this.viewer.scene);
        await this.cameraControls.fitToBox(boundingBox, enableTransition);
    }

    // 聚焦到场景
    async fitToSceneBySphere(enableTransition: boolean = true) {
        const sphere = Tool.getSceneSphere(this.viewer.scene);
        await this.cameraControls.fitToSphere(sphere, enableTransition);
    }

    async fitToMeshBySphere(objects: Object3D[], enableTransition: boolean = true) {
        const sphere = Tool.getSphereByObject3ds(objects);
        await this.cameraControls.fitToSphere(sphere, enableTransition);
    }

    async fitToMeshByBox3(objects: Object3D[], enableTransition: boolean = true) {
        const box3 = Tool.getBox3ByObject3ds(objects);
        await this.cameraControls.fitToBox(box3, enableTransition);
    }

    async fitToMeshByBox(box3OrObject: THREE.Box3 | THREE.Object3D,
                         enableTransition: boolean) {
        await this.cameraControls.fitToBox(box3OrObject, enableTransition);
    }
}
