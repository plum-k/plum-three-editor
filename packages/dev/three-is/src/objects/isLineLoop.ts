import * as THREE from "three";
import {get} from "lodash-es";

export const isLineLoop = (value: unknown): value is THREE.LineLoop => {
    return get(value, 'isLineLoop') === true;
}


        