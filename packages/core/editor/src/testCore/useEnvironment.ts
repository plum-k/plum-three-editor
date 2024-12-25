import {Viewer} from @plum-render/three-sdk";
import {EnvironmentMode} from @plum-render/three-sdk";

const useEnvironment = (viewer: Viewer) => {
    viewer.environment.setEnvironment({
        preset: 'warehouse',
        // mode: EnvironmentMode.BACKGROUND,
        mode: EnvironmentMode.ENVIRONMENT,
        // mode: EnvironmentMode.ALL,
    })
}

export default useEnvironment;