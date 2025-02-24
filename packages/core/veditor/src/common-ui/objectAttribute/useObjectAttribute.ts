import {useContext} from "react";
import {ObjectAttributeContext} from "./ObjectAttributeContext";
import {inject} from "vue";

export function useObjectAttribute() {
    const foo = inject(key) // foo 的类型：string | undefined
    return useContext(ObjectAttributeContext);
}

