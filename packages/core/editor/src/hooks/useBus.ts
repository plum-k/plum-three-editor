import {Viewer} from "@plum-render/three-sdk";
import {getCurrentInstance} from "vue";

export function useBus() {
    const {proxy, ctx} = getCurrentInstance()!
    return proxy!.bus;
}

