import {provide} from "vue";
import {Subject} from "rxjs";

export interface IObjectAttributeChange {
    name: string | string[];
    value: any;
}
export const useAttributeProvide = () => {
    const objectAttributeChangeSubject = new Subject<IObjectAttributeChange>();

    provide("AttributeChange", objectAttributeChangeSubject)
    return {
        objectAttributeChangeSubject
    }
}