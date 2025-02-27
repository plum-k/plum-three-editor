import * as THREE from "three";
import {get} from "lodash-es";

export const isFramebufferTexture = (value: unknown): value is THREE.FramebufferTexture => {
    return get(value, 'isFramebufferTexture') === true;
}


        