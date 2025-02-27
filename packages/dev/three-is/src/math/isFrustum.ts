import * as THREE from "three";
import {get} from "lodash-es";

export const isFrustum = (value: unknown): value is THREE.Frustum => {
    return get(value, 'isFrustum') === true;
}


        