import * as  THREE from "three";
import {Object3D} from "three";
import {Component, IComponentOptions} from "./Component";
import {isPerspectiveCamera} from "three-is";
import {isNil} from "lodash-es";
import {Tool} from "../tool/Tool";

export interface IPickOptions extends IComponentOptions {
}

export class Pick extends Component {
    raycaster: THREE.Raycaster;
    pointer: THREE.Vector2 = new THREE.Vector2();

    constructor(options: IPickOptions) {
        super(options);
        this.raycaster = new THREE.Raycaster();

        this.eventManager.leftClickSubject.subscribe((event) => {
            this.pointer.fromArray(Tool.getNFC(event, this.container))
            const pickObj = this.pick(this.scene, this.camera, event);
            this.eventManager.leftClickPickSubject.next(pickObj);
        })

        this.eventManager.rightClickSubject.subscribe((event) => {
            this.pointer.fromArray(Tool.getNFC(event, this.container))
            const pickObj = this.pick(this.scene, this.camera, event);
            this.eventManager.rightClickPickSubject.next(pickObj);
        })

        // todo 性能消耗大
        // this.eventManager.pointerMoveSubject.subscribe((event) => {
        //     this.pointer.fromArray(Tool.getNFC(event, this.container))
        //     const pickObj = this.pick(this.scene, this.camera, event);
        //     this.eventManager.pointerMovePickSubject.next(pickObj);
        // })

        this.eventManager.dblClickSubject.subscribe((event) => {
            this.pointer.fromArray(Tool.getNFC(event, this.container))
            const pickObj = this.pick(this.scene, this.camera, event);
            this.eventManager.dblClickPickSubject.next(pickObj);
        })
    }

    pick(scene: THREE.Scene, camera: THREE.Camera, event) {
        this.raycaster.setFromCamera(this.pointer, camera);
        // 计算物体和射线的焦点
        // const intersects = this.raycaster.intersectObject(scene);
        //
        // let obj = {
        //     position: intersects.length > 0 ? intersects[0].point : this.screenToWorld(),
        //     intersects
        // }
        // return obj

        const objects: Array<Object3D> = [];
        // 只选择可见的对象
        this.scene.traverseVisible((child) => {
            objects.push(child);
        });
        // todo 编辑器启用时, 可选择帮助对象
        this.sceneHelpers.traverseVisible((child) => {
            if ( child.name === 'picker' ) {
                objects.push( child );
            }
        });

        const intersectObject = this.raycaster.intersectObjects(objects, false);
        let obj = {
            position: intersects.length > 0 ? intersects[0].point : this.screenToWorld(),
            intersects
        }
        return intersectObject;
    }

    /**
     * 屏幕空间转世界空间
     * @param height
     */
    screenToWorld(height?: number) {
        let [x, y] = [this.pointer.x, this.pointer.y]
        const camera = this.camera;
        let screenPosition = new THREE.Vector3(x, y, 0);
        const cameraPosition = new THREE.Vector3();
        camera.updateProjectionMatrix();
        if (isPerspectiveCamera(camera)) {
            cameraPosition.setFromMatrixPosition(camera.matrixWorld);
            // 将屏幕坐标反投影到世界坐标
            screenPosition.unproject(camera)
            // 获取方向向量
            screenPosition.sub(cameraPosition).normalize();
        }
        // else if (isOrthographicCamera(camera)) {
        //     cameraPosition.set(x, y, (camera.near + camera.far) / (camera.near - camera.far)).unproject(camera);
        //     screenPosition.set(0, 0, -1).transformDirection(camera.matrixWorld);
        // }
        const min = 1e-4;
        const normalY = new THREE.Vector3(0, 1, 0)
        const dotNormalY = normalY.dot(screenPosition);
        const center = this.cameraManager.cameraControls.getTarget(new THREE.Vector3());
        if (!(Math.abs(dotNormalY) < min)) {
            // 计算距离
            const distance = (-cameraPosition.y + (height || 0) + center.y) / screenPosition.y; // center.y
            let position = (new THREE.Vector3).copy(cameraPosition).add((new THREE.Vector3).copy(screenPosition).multiplyScalar(distance));
            if (!isNil(height)) {
                position.y = height;
            }
            return position
        }
    }
}