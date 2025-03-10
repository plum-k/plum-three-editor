import {getCurrentInstance} from "vue";

export function useBus() {
    const {proxy} = getCurrentInstance()!
    return proxy!.bus;
}

