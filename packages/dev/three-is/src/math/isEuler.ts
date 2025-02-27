import * as THREE from "three";
import {get} from "lodash-es";

export const isEuler = (value: unknown): value is THREE.Euler => {
    return get(value, 'isEuler') === true;
}


        