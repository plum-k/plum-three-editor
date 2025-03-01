import {inject, onMounted, ref} from "vue";
import {get, isArray, isNil, type PropertyPath, set} from "lodash-es";
import {useBus} from "../../hooks";
import {isColor, isLight, isVector3} from "three-is";
import * as THREE from "three";

export interface IItemProps {
    name: PropertyPath
    label: string;
}

export const useItem = (props: IItemProps) => {
    const {name, label} = props;
    const bus = useBus();

    const tabActiveName = inject("tabActiveName", ref("属性"))

    bus.viewerInitSubject.subscribe(() => {

    })

    onMounted(() => {
        sync()
        const viewer = bus.viewer!;
        viewer.editor.editorEventManager.objectSelected.subscribe((object) => {
            
            sync();
        })
    })

    const getObject = () => {
        if (tabActiveName.value === "属性") {
            return bus.selectObject;
        }else if (tabActiveName.value === "几何"){
            return (bus.selectObject );
        }
        const object = bus.selectObject;
    }

    // 同步属性
    const sync = () => {
        const viewer = bus.viewer;
        if (!viewer) return
        const nameHasArray = isArray(name) && name.length > 1;

        const object = bus.selectObject;
        const value = get(object, name);
        if (isColor(value)) {
            model.value = `#${value.getHexString()}`
        } else if (isVector3(value)) {

        } else {
            if (nameHasArray && name[0] === "rotation") {
                model.value = THREE.MathUtils.degToRad(value);
            } else {
                model.value = value
            }
        }
        // 灯光没有 旋转和缩放
        if ((name === "rotation" || name === "scale") && isLight(object)) {
            show.value = false
        } else {
            show.value = !isNil(value)
        }
    }

    const change = (val: any) => {
        const object = bus.selectObject;
        if (!object) return;
        set(object, name, val);
    }
    const show = ref(false);
    const model = ref();

    return {
        show,
        model,
        change,
    }
}