import {Viewer} from "@plum-render/three-sdk";
import {Subject} from "rxjs";
import {isMesh} from "three-is";


export class Bus {

    // 视图
    viewer: Viewer | null = null;
    viewerInitSubject = new Subject<boolean>();

    constructor() {
    }

    get editor() {
        return this.viewer?.editor
    }

    // 选中的对象
    get selectObject() {
        return this.viewer?.editor.selector.selectObject;
    }

    // 选中的几何体
    get selectGeometry() {
        if (isMesh(this.selectObject)) {
            return this.selectObject.geometry;
        }
        return null
    }

    // 设置视图
    setViewer(value: Viewer) {
        this.viewer = value;
    }
}



