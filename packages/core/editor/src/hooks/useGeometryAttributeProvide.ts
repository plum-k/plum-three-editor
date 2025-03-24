import {provide} from "vue";
import {Subject} from "rxjs";
import {isMesh} from "three-is";

import {useBus} from "./useBus.ts";
import {isArray, type PropertyPath} from "lodash-es";
import {useToggle} from "@vueuse/core";

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

export interface IUseGeometryAttributeProvide {
    isAutoUpdate: boolean;
    getNewGeometry: (geometry: any, name: string, value: any) => any;
}

export const useGeometryAttributeProvide = (options: IUseGeometryAttributeProvide) => {
    const {isAutoUpdate = true, getNewGeometry} = options;
    const objectAttributeChangeSubject = new Subject<IObjectAttributeChange>();
    const bus = useBus();
    const viewer = bus.viewer;
    const [updateTrigger, toggle] = useToggle(false)
    provide("objectAttributeChangeSubject", objectAttributeChangeSubject)
    provide("updateTrigger", updateTrigger)
    provide("getObject", () => {
        if (isMesh(bus.selectObject)) {
            return bus.selectObject.geometry
        }
    })
    objectAttributeChangeSubject.subscribe((editValue) => {
        const {name, value} = editValue;
        const object = bus.selectObject;
        const editor = bus.editor!
        if (!isMesh(object)) return;
        if (!isArray(name)) {
            editor.setValueExecute(object, ["geometry", name], value);
        } else {
            const geometry = object.geometry as BoxGeometry;
            const _newGeometry = getNewGeometry(geometry, name, value);
            // object.geometry.dispose();
            geometry.copy(_newGeometry);
        }
    })

    return {
        objectAttributeChangeSubject, toggle, getGeometryValue, updateTrigger
    }
}