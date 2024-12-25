import {useMemo} from "react";
import {useViewer} from "./useStore.ts";


const useEditor = () => {
    const viewer = useViewer();
    return useMemo(() => {
        return viewer?.editor
    }, [viewer]);
}

export default useEditor;