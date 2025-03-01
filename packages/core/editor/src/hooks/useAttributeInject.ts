import {inject} from "vue";
import {useBus} from "./useViewer.ts";
import {Subject} from "rxjs";
import type {IObjectAttributeChange} from "./useAttributeProvide.ts";

export interface IAttributeProps {
    name: string | string[];
    label: string;
}

export const useAttributeInject = (props: IAttributeProps) => {
    const objectAttributeChangeSubject = inject<Subject<IObjectAttributeChange>>("AttributeChange")!;
    const {name, label} = props;
    const bus = useBus();
    const change = (value: any) => {
        
        objectAttributeChangeSubject!.next({
            name: name,
            value: value
        });
    }
    return {objectAttributeChangeSubject, change};
}

