import {useToggle} from "@vueuse/core";
import {useBus} from "./useBus.ts";
import {onMounted, onUnmounted} from "vue";
import {Subscription} from "rxjs";

interface IUseBindSubscribe {
    /**
     * 改变时调用的函数
     */
    fun: Function
    /**
     * 是否在页面挂载后绑定
     */
    isMounted?: boolean;
    /**
     * 是否场景初始化后绑定
     */
    isViewerInit?: boolean;
    /**
     * 是否在绑定后自动调用函数
     */
    isBindCallFun?: boolean;
}


/**
 * 监听选择的3d对象变化
 */
export const useBindSubscribe = (options: IUseBindSubscribe) => {
    const {fun, isMounted = true, isViewerInit = false, isBindCallFun = false} = options;
    const [isBind, toggle] = useToggle(false)
    const bus = useBus();
    let subscription: Subscription;
    bus.viewerInitSubject.subscribe(() => {
        if (isViewerInit) {
            bindSubscribe()
        }
    })

    const bindSubscribe = () => {
        if (!isBind.value) {
            const viewer = bus.viewer;
            if (!viewer) return;
            subscription = viewer.editor.editorEventManager.objectSelected.subscribe(() => {
                fun();
            })
            toggle()
            if (isBindCallFun) {
                fun();
            }
        }
    }
    onMounted(() => {
        if (!isMounted) return;
        bindSubscribe();
    })

    onUnmounted(() => {
        if (subscription) {
            subscription.unsubscribe();
        }
    })
    return {bindSubscribe}
}