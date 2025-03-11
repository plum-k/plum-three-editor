import {inject, onMounted, ref,type ShallowRef, watch} from "vue";
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
 */
export const useAttributeInject = (props: IAttributeProps) => {
    const objectAttributeChangeSubject = inject<Subject<IObjectAttributeChange>>("objectAttributeChangeSubject")!;
    const {name, isMiddle = false, getValue = (value) => value} = props;
    const change = (value: any) => {
        objectAttributeChangeSubject!.next({
            name: name,
            value: value,
            initValue: isMiddle ? initValue.value : null
        });
    }
    const activeChange = (value: any) => {
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
        console.log("updateTrigger", updateTrigger.value)
        seyModelValue()
    })
    // const getValue = inject<(value:any) => any>("getValue",(value)=>{
    //     return value
    // })!;
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
    const modelValue = ref();
    onMounted(() => {
        // logStack()
        seyModelValue();
        initValue.value = modelValue.value;
        // console.log("value", value)
        // console.log("testA.value", testA.value)
    })
    return {
        objectAttributeChangeSubject, focus, change, activeChange, modelValue
    };
}

