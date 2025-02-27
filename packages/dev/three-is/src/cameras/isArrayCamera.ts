import * as THREE from "three";
import {get} from "lodash-es";

export const isArrayCamera = (value: unknown): value is THREE.ArrayCamera => {
    return get(value, 'isArrayCamera') === true;
}


        