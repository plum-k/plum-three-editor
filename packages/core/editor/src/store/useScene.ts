import {useMemo} from "react";
import {useViewer} from "./useStore.ts";


const useScene = () => {
    const viewer = useViewer();
    return useMemo(() => {
        return viewer?.scene
    }, [viewer]);
}

export default useScene;