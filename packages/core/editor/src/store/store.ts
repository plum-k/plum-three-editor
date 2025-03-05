import {defineStore} from "pinia";
import {ref} from "vue";

export const useStore = defineStore('store', () => {
    const showSceneStatistics = ref(false)

    const setShowSceneStatistics = (value: boolean) => {
        showSceneStatistics.value = value
    }
    return {
        showSceneStatistics, setShowSceneStatistics
    }
})


