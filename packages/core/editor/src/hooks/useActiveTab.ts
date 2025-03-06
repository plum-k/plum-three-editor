import {computed, inject, ref} from "vue";

export const useActiveTab = (tabName: string) => {
    const tabActiveName = inject("tabActiveName", ref(""))

    const isActive = computed(() => {
        return tabActiveName.value === tabName
    })

    return {
        isActive,
    }
}

