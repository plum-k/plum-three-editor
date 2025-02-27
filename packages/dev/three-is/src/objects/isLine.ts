import * as THREE from "three";
import {get} from "lodash-es";

export const isLine = (value: unknown): value is THREE.Line => {
    return get(value, 'isLine') === true;
}


        