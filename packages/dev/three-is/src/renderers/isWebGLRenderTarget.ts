import * as THREE from "three";
import {get} from "lodash-es";

const isWebGLRenderTarget = (value: unknown): value is THREE.WebGLRenderTarget => {
    return get(value, 'isWebGLRenderTarget') === true;
}

export default isWebGLRenderTarget;
        