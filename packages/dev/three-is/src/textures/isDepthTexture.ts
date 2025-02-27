import * as THREE from "three";
import {get} from "lodash-es";

export const isDepthTexture = (value: unknown): value is THREE.DepthTexture => {
    return get(value, 'isDepthTexture') === true;
}


        