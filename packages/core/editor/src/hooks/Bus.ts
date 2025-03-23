import {Viewer} from "@plum-render/three-sdk";
import {Subject} from "rxjs";
import {isMesh} from "three-is";
import {isArray} from "lodash-es";

export class Bus {

    // 视图
    viewer: Viewer | null = null;
    viewerInitSubject = new Subject<boolean>();
    materialIndex = 0

    constructor() {
    }

    get editor() {
        return this.viewer?.editor
    }

    /**
     * 选中的对象
     */
    get selectObject() {
        return this.viewer?.editor.selector.selectObject;
    }

    get scene() {
        return this.viewer?.scene;
    }

    /**
     * 选中的几何
     */
    get selectGeometry() {
        if (isMesh(this.selectObject)) {
            return this.selectObject.geometry;
        }
        return null
    }

    /**
     * 选中的材质
     */
    get selectMaterial() {
        if (isMesh(this.selectObject)) {
            const _material = this.selectObject.material;
            if (isArray(_material)) {
                return _material[this.materialIndex]
            } else {
                return _material
            }
        }
        return null
    }

    // 设置视图
    setViewer(value: Viewer) {
        this.viewer = value;
    }
}



