import {provide} from "vue";
import {Subject} from "rxjs";
import {isMesh, isObject3D} from "three-is";
import * as THREE from "three";
import {useBus} from "./useBus.ts";
import {invoke} from "lodash-es";

export interface IObjectAttributeChange {
    name: string | string[];
    // 更新值
    value: any;
    // 初始值
    initValue?: any;
}

export const useAttributeProvide = (isAutoUpdate: boolean = true) => {
    const objectAttributeChangeSubject = new Subject<IObjectAttributeChange>();
    const bus = useBus();
    provide("AttributeChange", objectAttributeChangeSubject)
    provide("getObject", ()=>{
        return bus.selectObject
    })
    if (isAutoUpdate) {
        objectAttributeChangeSubject.subscribe((editValue) => {
            const {name, value, initValue} = editValue;
            console.log("name", name, value)
            const object = bus.selectObject;
            const editor = bus.editor!;
            if (!isObject3D(object)) return;
            if (initValue) {
                if (name === "color") {
                    // 颜色只有在最后一次更新时才会添加记录
                    editor.setColorValueCommand(object, name, value, initValue);
                }
            }else {
                // 没有更新过程的
                if (["rotation"].includes(name[0])) {
                    editor.setValueExecute(object, name, THREE.MathUtils.degToRad(value));
                } else if (name==="color") {
                    invoke(object, "color.setStyle", value);
                } else {
                    editor.setValueExecute(object, name, value);
                }
            }
        })
    }

    return {
        objectAttributeChangeSubject
    }
}