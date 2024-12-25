import * as THREE from "three";
import {get} from "lodash-es";

const isWebGLCubeRenderTarget = (value: unknown): value is THREE.WebGLCubeRenderTarget => {
    return get(value, 'isWebGLCubeRenderTarget') === true;
}

export default isWebGLCubeRenderTarget;
        