import {provide} from "vue";
import {Subject} from "rxjs";
import {isMesh, isTexture} from "three-is";
import * as THREE from "three";
import {useBus} from "./useBus.ts";
import {isArray, type PropertyPath} from "lodash-es";
import {useToggle} from "@vueuse/core";
import {isColorString} from "./tool/isColorString.ts";

export const getGeometryValue = (geometry: any, att: string, name: any, value: any) => {
    if (isArray(name) && name[0] === "parameters") {
        const key = name[1];
        if (key === att) {
            return value
        } else {
            return geometry.parameters[key]
        }
    }
}

export interface IObjectAttributeChange {
    name: PropertyPath
    // 更新值
    value: any;
    // 初始值
    initValue?: any;
}

export interface IUseMaterialAttributeProvide {
    isAutoUpdate: boolean;
}

export const useMaterialAttributeProvide = (options: IUseMaterialAttributeProvide) => {
    const {isAutoUpdate = true,} = options;
    const objectAttributeChangeSubject = new Subject<IObjectAttributeChange>();
    const bus = useBus();
    const viewer = bus.viewer;
    const [updateTrigger, toggle] = useToggle(false)

    const getObject = () => {
        if (isMesh(bus.selectObject)) {
            const _material = bus.selectObject.material;
            return isArray(_material) ? _material[0] as THREE.MeshStandardMaterial : _material
        }
    }

    provide("objectAttributeChangeSubject", objectAttributeChangeSubject)
    provide("updateTrigger", updateTrigger)
    provide("getObject", getObject)
    objectAttributeChangeSubject.subscribe((editValue) => {
        const {name, value, initValue} = editValue;
        const object = bus.selectObject;
        const editor = bus.editor!
        if (!isMesh(object)) return;
        if (!isArray(name)) {
            if (isColorString(value)) {
                editor.setMaterialColorExecute(object, name, value, initValue);
                // invoke(getObject(), [name as string, "setStyle"], value);
            } else if (isTexture(value)) {
                console.log("aaaa",value)
                editor.setMaterialValueExecute(object, name, value, -1)
            } else {
                editor.setMaterialValueExecute(object, name, value)
            }
        }
    })

    return {
        objectAttributeChangeSubject, toggle, getGeometryValue, updateTrigger
    }
}