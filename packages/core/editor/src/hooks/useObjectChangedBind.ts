import {useToggle} from "@vueuse/core";
import {useBus} from "./useBus.ts";
import {onMounted, onUnmounted} from "vue";
import {Subscription} from "rxjs";

interface IUseObjectChangedBind {
    /**
     * 改变时调用的函数
     */
    fun: Function
    /**
     * 是否在页面挂载后绑定
     */
    isMounted?: boolean;
}


/**
 * 监听选着的对象属性变化
 */
export const useObjectChangedBind = (options: IUseObjectChangedBind) => {
    const {fun, isMounted = true} = options;
    const [isBind, toggle] = useToggle(false)
    const bus = useBus();
    let subscription: Subscription;

    const bindSubscribe = () => {
        if (!isBind.value) {
            const viewer = bus.viewer;
            if (!viewer) return;
            subscription = viewer.editor.editorEventManager.objectChanged.subscribe(() => {
                fun();
            })
            toggle()
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