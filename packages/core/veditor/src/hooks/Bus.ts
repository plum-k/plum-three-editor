import {Viewer} from "@plum-render/three-sdk";
import {Subject} from "rxjs";

export interface IObjectAttributeChange {
    name: string | string[];
    value: any;
}


export class Bus {

    // 视图
    viewer: Viewer | null = null;
    viewerInitSubject = new Subject<boolean>();
    // ui 表单变化
    objectAttributeChangeSubject = new Subject<IObjectAttributeChange>();

    constructor() {
    }

    // 选中的对象
    get selectObject() {
        return this.viewer?.editor.selector.selectObject;
    }


    // 设置视图
    setViewer(value: Viewer) {
        this.viewer = value;
    }
}



