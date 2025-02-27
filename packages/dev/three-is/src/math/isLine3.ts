import * as THREE from "three";
import {get} from "lodash-es";

export const isLine3 = (value: unknown): value is THREE.Line3 => {
    return get(value, 'isLine3') === true;
}


        