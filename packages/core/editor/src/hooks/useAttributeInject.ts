import {inject, onMounted, ref,type ShallowRef, watch,defineModel} from "vue";
import {Subject} from "rxjs";
import type {IObjectAttributeChange} from "./useAttributeProvide.ts";
import {get, type PropertyPath} from "lodash-es";

export interface IAttributeProps {
    /**
     * 属性名
     */
    name: PropertyPath;
    /**
     * 显示名
     */
    label: string;
    /**
     * 是否有中间属性
     */
    isMiddle?: boolean;
    /**
     * 获取属性值
     * @param value
     */
    getValue?: (value: any) => any
}

/**
 * 向上派发属性改变事件
 * @param props
 * @param modelValue
 */
export const useAttributeInject = (props: IAttributeProps,modelValue: ShallowRef<any>) => {
    const objectAttributeChangeSubject = inject<Subject<IObjectAttributeChange>>("objectAttributeChangeSubject")!;
    const {name, isMiddle = false, getValue = (value) => value} = props;
    // 为 undefined 时，从getObject 中读取值
    const isHasInitValue = modelValue.value !== undefined;
    const change = (value: any) => {
        // if (isHasInitValue) return
        objectAttributeChangeSubject!.next({
            name: name,
            value: value,
            initValue: isMiddle ? initValue.value : null
        });
    }
    const activeChange = (value: any) => {
        if (isHasInitValue) return
        objectAttributeChangeSubject!.next({
            name: name,
            value: value,
        });
    }
    // 初始值
    const initValue = ref("");
    // 聚焦
    const focus = () => {
        setInitValue();
    }
    const getObject = inject<() => object>("getObject")!;
    const updateTrigger = inject<ShallowRef<boolean>>("updateTrigger")!;

    watch(updateTrigger, () => {
        if (isHasInitValue) return
        // console.log("updateTrigger", updateTrigger.value)
        seyModelValue()
    })

    const seyModelValue = () => {
        const object = getObject();
        let _value = get(object, name)
        modelValue.value = getValue(_value);
    }
    const setInitValue = () => {
        const object = getObject();
        let _value = get(object, name)
        initValue.value = getValue(_value);
    }
    // const modelValue = ref();

    onMounted(() => {
        if (isHasInitValue) return
        // logStack()
        seyModelValue();
        initValue.value = modelValue.value;
        // console.log("value", value)
        // console.log("testA.value", testA.value)
    })
    return {
        objectAttributeChangeSubject, focus, change, activeChange,
    };
}

