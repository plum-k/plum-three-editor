import {EnvironmentMode, Viewer} from "@plum-render/three-sdk";

const useEnvironment = (viewer: Viewer) => {
    viewer.environmentManage.setEnvironment({
        preset: 'warehouse',
        // mode: EnvironmentMode.BACKGROUND,
        mode: EnvironmentMode.ENVIRONMENT,
        // mode: EnvironmentMode.ALL,
    })
}

export default useEnvironment;