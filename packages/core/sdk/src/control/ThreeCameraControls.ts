import * as THREE from 'three';
import {Object3D, OrthographicCamera, PerspectiveCamera, Sphere} from 'three';
import CameraControls from "camera-controls";
import {Viewer} from "../core/Viewer";
import {deepMergeRetain} from "../tool";
import {isGroup, isMesh} from "three-is";

// 安装camera-controls扩展，使其支持THREE库
CameraControls.install({THREE: THREE});

/**
 * 交互控制类，用于管理Three.js场景中的摄像机控制。
 */
export interface IThreeCameraControls {
    viewer: Viewer;
}

export enum CameraViewType {
    Top = "top",        // 顶视图
    Bottom = "bottom",  // 底视图
    Left = "left",      // 左视图
    Right = "right",    // 右视图
    Back = "back",      // 后视图
    Front = "front",    // 前视图
    Ortho = "ortho",    // 正交视图
    Perspective = "perspective" // 透视视图
}

/**
 * ThreeCameraControls类负责初始化和管理Three.js的摄像机控制。
 * 它通过与viewer实例配合，提供交互式摄像机控制功能。
 */
export class ThreeCameraControls {
    options: any;
    viewer: Viewer
    perspectiveCamera: PerspectiveCamera
    orthographicCamera : OrthographicCamera;
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
        this.perspectiveCamera.aspect = width / height;
        this.perspectiveCamera.updateProjectionMatrix();
    }

    /**
     * 设置不同的视图模式
     * @param cameraViewType
     */
    setCameraViewType(cameraViewType: CameraViewType) {
        switch (cameraViewType) {
            case CameraViewType.Top:
                this.toTopView();
                break;
            case CameraViewType.Bottom:
                this.toBottomView();
                break;
            case CameraViewType.Left:
                this.toLeftView();
                break;
            case CameraViewType.Right:
                this.toRightView();
                break;
            case CameraViewType.Back:
                this.toBackView();
                break;
            case CameraViewType.Front:
                this.toFrontView();
                break;
            case CameraViewType.Ortho:
                this.toOrtho();
                break;
            case CameraViewType.Perspective:
            default:
                this.toPerspective();
                break;
        }
    }

    toTopView() {
        // this._initRange();
        // this.setOrthographic(true);
        this.cameraControls.rotatePolarTo(0).then();

        this.cameraControls.minAzimuthAngle = -Infinity;
        this.cameraControls.maxAzimuthAngle = Infinity;
        this.cameraControls.minPolarAngle = 0;
        this.cameraControls.maxPolarAngle = 0;
    }

    toBottomView() {
        // this._initRange();
        // this.setOrthographic(true);
        this.cameraControls.rotatePolarTo(Math.PI);
        this.cameraControls.minAzimuthAngle = -Infinity;
        this.cameraControls.maxAzimuthAngle = Infinity;
        this.cameraControls.minPolarAngle = Math.PI;
        this.cameraControls.maxPolarAngle = Math.PI;
    }

    toLeftView() {
        // this._initRange();
        // this.setOrthographic(true);
        this.cameraControls.rotateTo(-90, 90, {enableTransition: false});
        this.cameraControls.minAzimuthAngle = -Math.PI;
        this.cameraControls.maxAzimuthAngle = -Math.PI;
        this.cameraControls.minPolarAngle = Math.PI / 2;
        this.cameraControls.maxPolarAngle = Math.PI / 2;
    }

    toRightView() {
        // this._initRange();
        // this.setOrthographic(true);
        this.cameraControls.rotateTo(90, 90, {enableTransition: false});
        this.cameraControls.minAzimuthAngle = Math.PI;
        this.cameraControls.maxAzimuthAngle = Math.PI;
        this.cameraControls.minPolarAngle = Math.PI / 2;
        this.cameraControls.maxPolarAngle = Math.PI / 2;
    }

    toBackView() {
        // this._initRange();
        // this.setOrthographic(true);
        this.cameraControls.rotateTo(-180, 90, {enableTransition: false});
        this.cameraControls.minAzimuthAngle = -Math.PI;
        this.cameraControls.maxAzimuthAngle = -Math.PI;
        this.cameraControls.minPolarAngle = Math.PI / 2;
        this.cameraControls.maxPolarAngle = Math.PI / 2;
    }

    toFrontView() {
        // this._initRange();
        // this.setOrthographic(true);
        this.cameraControls.rotateTo(0, 90, {enableTransition: false});
        this.cameraControls.minAzimuthAngle = 0;
        this.cameraControls.maxAzimuthAngle = 0;
        this.cameraControls.minPolarAngle = Math.PI / 2;
    }

    toOrtho() {
        this.toPerspective();
        // this._initRange();
        // this.setOrthographic(true);
        this.setInteract({
            mouseButtonMiddle: "pan"
        });
    }

    toPerspective() {
        // this._initRange();
        // this.setOrthographic(false);
        // this.resetInteract();
        // this.saveState();
        // this.resetState();
    }

    getBox3ByObject3ds(objects: Object3D[]) {
        const box3 = new THREE.Box3();
        for (let i = 0; i < objects.length; i++) {
            const object = objects[i];
            if (isMesh(object)) {
                if (object.geometry.boundingBox === null) {
                    object.geometry.computeBoundingBox();
                }
                box3.union(object.geometry.boundingBox!.clone().applyMatrix4(object.matrixWorld));
            } else if (isGroup(object)) {
                const box = new THREE.Box3();
                box.setFromObject(object);
                box3.union(box)
            }
        }
        return box3;
    }

    getSphereByObject3ds(objects: Object3D[]) {
        const sphere = new THREE.Sphere();
        for (let i = 0; i < objects.length; i++) {
            const object = objects[i];
            if (isMesh(object)) {
                if (object.geometry.boundingSphere === null) {
                    object.geometry.computeBoundingSphere();
                }
                sphere.union(object.geometry.boundingSphere!.clone().applyMatrix4(object.matrixWorld));
            } else if (isGroup(object)) {
                const box = new THREE.Box3();
                box.setFromObject(object);
                sphere.union(box.getBoundingSphere(new Sphere()))
            }
        }
        return sphere;
    }

    // 获取场景的包围盒
    getSceneBox() {
        const box3 = new THREE.Box3();
        this.viewer.scene.traverse((mesh) => {
            if (isMesh(mesh)) {
                mesh.geometry.computeBoundingBox();
                if (mesh.geometry.boundingBox) {
                    box3.union(mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld));
                }
            }
        });
        return box3;
    }

    getSceneSphere() {
        const sphere = new THREE.Sphere();
        this.viewer.scene.traverse((mesh) => {
            if (isMesh(mesh)) {
                mesh.geometry.computeBoundingSphere()
                if (mesh.geometry.boundingSphere) {
                    sphere.union(mesh.geometry.boundingSphere.clone().applyMatrix4(mesh.matrixWorld));
                }
            }
        });
        return sphere;
    }

    // 聚焦到场景
    async fitToSceneByBox(enableTransition: boolean = true) {
        const boundingBox = this.getSceneBox();
        await this.cameraControls.fitToBox(boundingBox, enableTransition);
    }

    // 聚焦到场景
    async fitToSceneBySphere(enableTransition: boolean = true) {
        const sphere = this.getSceneSphere();
        await this.cameraControls.fitToSphere(sphere, enableTransition);
    }

    async fitToMeshBySphere(objects: Object3D[], enableTransition: boolean = true) {
        const sphere = this.getSphereByObject3ds(objects);
        await this.cameraControls.fitToSphere(sphere, enableTransition);
    }

    async fitToMeshByBox3(objects: Object3D[], enableTransition: boolean = true) {
        const box3 = this.getBox3ByObject3ds(objects);
        await this.cameraControls.fitToBox(box3, enableTransition);
    }

    async fitToMeshByBox(box3OrObject: THREE.Box3 | THREE.Object3D,
                         enableTransition: boolean) {
        await this.cameraControls.fitToBox(box3OrObject, enableTransition);
    }

    // setOrthographic(isOrthographic) {
    //     if (!this.isOrthographic) {
    //         // this.saveInteract();
    //     }
    //     if (isNull(isOrthographic) || this.isOrthographic === isOrthographic) return this;
    //     const enable = this.viewer.rendererManager.effectRenderer.enable;
    //     this.viewer.rendererManager.setMainRendererEnable(false);
    //     const { perspectiveCamera, orthographicCamera,
    //         orthographicCameraControls, perspectiveCameraControls } = this;
    //     const center = this.center;
    //     const position = this.position;
    //     if (isOrthographic) {
    //         if (!this.isOrthographic) {
    //             // Thanks for sharing : https://stackoverflow.com/questions/48187416/how-to-switch-between-perspective-and-orthographic-cameras-keeping-size-of-desir
    //             const fov = perspectiveCamera.fov;
    //             const far = perspectiveCamera.far;
    //             const depth = Math.tan(fov / 2.0 * Math.PI / 180.0) * 2.0;
    //             var z = position.distanceTo(center);
    //             var y = depth * z;
    //             var x = y * perspectiveCamera.aspect;
    //
    //             orthographicCamera.left = - x / 2;
    //             orthographicCamera.right = x / 2
    //             orthographicCamera.top = y / 2;
    //             orthographicCamera.bottom = - y / 2;
    //             orthographicCamera.zoom = 1;
    //
    //             orthographicCamera.position.copy(position);
    //             orthographicCamera.lookAt(center);
    //
    //             orthographicCameraControls.setLookAt(position.x, position.y, position.z, center.x, center.y, center.z, false);
    //             this.cameraControls._sphericalEnd.makeSafe();
    //             this.cameraControls._needsUpdate = true;
    //         }
    //     } else {
    //         if (this.isOrthographic) {
    //             const pos = position.clone();
    //             pos.y = position.y / orthographicCamera.zoom;
    //
    //             perspectiveCamera.position.copy(pos);
    //             perspectiveCamera.lookAt(center);
    //
    //             perspectiveCameraControls.setLookAt(position.x, position.y, position.z, center.x, center.y, center.z, false);
    //             this.cameraControls._sphericalEnd.makeSafe();
    //             this.cameraControls._needsUpdate = true;
    //         }
    //     }
    //
    //     this.isOrthographic = !this.isOrthographic;
    //     this.camera.updateProjectionMatrix();
    //     this._cameraUpdateDelay();
    //     return this;
    // }
}
