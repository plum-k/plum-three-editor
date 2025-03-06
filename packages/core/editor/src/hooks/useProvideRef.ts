import type {Ref, UnwrapRef} from "vue";
import {ref,} from "vue";
import {provide} from "@vue/runtime-core";

export const useProvideRef = <T>(name: string, initValue: T) => {
    const value = ref<T>(initValue) as Ref<UnwrapRef<T>>
    provide(name, value)
    return value
}