import {Viewer} from "@plum-render/three-sdk";
import {getCurrentInstance} from "vue";

export function useBus() {
    const {proxy, ctx} = getCurrentInstance()!
    return proxy!.bus;
}

export function useSetViewer() {
    const {proxy, ctx} = getCurrentInstance()!
    return (value: Viewer) => {
        proxy!.bus.setViewer(value)
    };
}


