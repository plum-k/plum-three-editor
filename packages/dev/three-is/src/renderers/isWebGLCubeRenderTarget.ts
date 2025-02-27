import * as THREE from "three";
import {get} from "lodash-es";

export const isWebGLCubeRenderTarget = (value: unknown): value is THREE.WebGLCubeRenderTarget => {
    return get(value, 'isWebGLCubeRenderTarget') === true;
}


        