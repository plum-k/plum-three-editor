import {useToggle} from "@vueuse/core";
import {useBus} from "./useBus.ts";
import {onMounted, onUnmounted} from "vue";
import {Subscription} from "rxjs";


/**
 * 监听对象选择的变化
 */
export const useBindSubscribe = (fun: Function, isMounted: boolean = true) => {
    const [isBind, toggle] = useToggle(false)
    const bus = useBus();
    let subscription: Subscription;

    const bindSubscribe = () => {
        if (!isBind.value) {
            const viewer = bus.viewer;
            if (!viewer) return;
            subscription = viewer.editor.editorEventManager.objectSelected.subscribe(() => {
                fun();
            })
            toggle()
        }
    }
    onMounted(() => {
        if (!isMounted) return;
        const viewer = bus.viewer;
        if (!viewer) return;
        fun();
        subscription = viewer.editor.editorEventManager.objectSelected.subscribe(() => {
            fun();
        })
    })

    onUnmounted(() => {
        if (subscription) {
            subscription.unsubscribe();
        }
    })
    return {bindSubscribe}
}