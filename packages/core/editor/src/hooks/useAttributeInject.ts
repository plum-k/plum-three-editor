import {inject} from "vue";
import {Subject} from "rxjs";
import type {IObjectAttributeChange} from "./useAttributeProvide.ts";

export interface IAttributeProps {
    /**
     * 属性名
     */
    name: string;
    /**
     * 显示名
     */
    label: string;
}

/**
 * 向上派发属性改变事件
 * @param props
 */
export const useAttributeInject = (props: IAttributeProps) => {
    const objectAttributeChangeSubject = inject<Subject<IObjectAttributeChange>>("AttributeChange")!;
    const {name} = props;
    const change = (value: any) => {
        objectAttributeChangeSubject!.next({
            name: name,
            value: value
        });
    }
    return {objectAttributeChangeSubject, change};
}

