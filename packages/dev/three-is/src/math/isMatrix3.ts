import * as THREE from "three";
import {get} from "lodash-es";

export const isMatrix3 = (value: unknown): value is THREE.Matrix3 => {
    return get(value, 'isMatrix3') === true;
}


        