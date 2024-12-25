import * as THREE from "three";
import {get} from "lodash-es";

const isWebGLRenderer = (value: unknown): value is THREE.WebGLRenderer => {
    return get(value, 'isWebGLRenderer') === true;
}

export default isWebGLRenderer;
        