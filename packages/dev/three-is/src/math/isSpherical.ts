import * as THREE from "three";
import {get} from "lodash-es";

export const isSpherical = (value: unknown): value is THREE.Spherical => {
    return get(value, 'isSpherical') === true;
}


        