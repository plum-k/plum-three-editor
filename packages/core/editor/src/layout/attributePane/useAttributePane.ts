import {computed, inject, ref} from "vue";

export interface AttributePaneNameProps {
    tabName: string
}


export const useAttributePane = (props: AttributePaneNameProps) => {
    const tabActiveName = inject("tabActiveName", ref("属性"))

    const isActive = computed(() => {
        return tabActiveName.value === props.tabName
    })

    return {
        isActive
    }
}

