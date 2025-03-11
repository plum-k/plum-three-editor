import {provide} from "vue";
import {Subject} from "rxjs";
import {isObject3D} from "three-is";
import * as THREE from "three";
import {useBus} from "./useBus.ts";
import {invoke, type PropertyPath} from "lodash-es";
import {useToggle} from "@vueuse/core";

export interface IObjectAttributeChange {
    name: PropertyPath
    // 更新值
    value: any;
    // 初始值
    initValue?: any;
}

export interface IUseAttributeProvide {
    isAutoUpdate: boolean;
    getObject: () => any;
}

export const useAttributeProvide = (options: IUseAttributeProvide) => {
    const {isAutoUpdate = true, getObject} = options;
    console.log("getObject",getObject)
    const objectAttributeChangeSubject = new Subject<IObjectAttributeChange>();
    const bus = useBus();
    const viewer = bus.viewer;
    const [updateTrigger, toggle] = useToggle(false)
    provide("objectAttributeChangeSubject", objectAttributeChangeSubject)
    provide("updateTrigger", updateTrigger)
    provide("getObject", getObject)

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
            } else {
                // 没有更新过程的
                if (["rotation"].includes(name[0])) {
                    editor.setValueExecute(object, name, THREE.MathUtils.degToRad(value));
                } else if (name === "color") {
                    invoke(object, "color.setStyle", value);
                } else {
                    editor.setValueExecute(object, name, value);
                }
            }
        })
    }

    return {
        objectAttributeChangeSubject, toggle
    }
}