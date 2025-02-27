import * as THREE from "three";
import {get} from "lodash-es";

export const isWebGLRenderTarget = (value: unknown): value is THREE.WebGLRenderTarget => {
    return get(value, 'isWebGLRenderTarget') === true;
}


        