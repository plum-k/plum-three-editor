import {isArray, isNil} from "lodash-es";
import {Component, IComponentOptions} from "../core/Component";
import * as  THREE from "three";
import {isObject3D} from "three-is";

export interface ISelectorOptions extends IComponentOptions {
}

// 对象选择相关封装
export class Selector extends Component {
    selectObject: THREE.Object3D | undefined = undefined
    selectionBox: THREE.BoxHelper = new THREE.BoxHelper(new THREE.Object3D())

    constructor(options: ISelectorOptions) {
        super(options);
        
        this.initSelectionBox();
        this.initEvent();
    }

    /**
     * 初始化包围盒
     */
    initSelectionBox() {
        if (isArray(this.selectionBox.material)) {
        } else {
            this.selectionBox.material.depthTest = false;
            this.selectionBox.material.transparent = true;
        }

        this.selectionBox.visible = false;
        this.sceneHelpers.add(this.selectionBox);
    }


    /**
     * 初始化事件
     */
    initEvent() {
        // 监听点击事件, 选择物体
        this.eventManager.leftClickPickSubject.subscribe((value) => {
            const {intersects,} = value;
            console.log("intersects",intersects)
            if (intersects.length > 0) {
                const object = intersects[0].object;
                // 如果是帮助对象, 则选择对应的对象
                if (isObject3D(object.userData.object)) {
                    this.select(object.userData.object);
                }else {
                    this.select(object);
                }
            } else {
                this.select(undefined);
            }
        })
        // 选择对象变化时, 更新控件附加目标
        this.editor.editorEventManager.objectSelected.subscribe((object) => {
            this.selectionBox.visible = false;
            this.editor.transformControlsWarp.transformControls.detach();
            if (isNil(object)) {
                this.editor.transformControlsWarp.transformControls.detach();
            } else {
                this.selectionBox.setFromObject(object);
                this.selectionBox.visible = true;
                this.editor.transformControlsWarp.transformControls.attach(object);
            }
        })
        // 选择对象属性改变时, 更新包围盒 和 辅助对象
        this.editor.editorEventManager.objectChanged.subscribe((object) => {
            console.log('object',object)
            this.selectionBox.setFromObject(object);
            this.editor.helperUpdate(object)
        })
    }


    /**
     * 选择对象
     * @param object
     */
    select(object: THREE.Object3D | undefined) {
        if (!isNil(object) && this.selectObject != object) {
            this.selectObject = object;
            this.editor.editorEventManager.objectSelected.next(object);
        }
        if (isNil(object)) {
            this.selectObject = object;
            this.editor.editorEventManager.objectSelected.next(object);
        }
    }

    /**
     * 取消选择对象
     */
    deselect() {
        this.select(undefined);
    }
}
