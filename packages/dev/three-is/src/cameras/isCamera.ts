import * as THREE from "three";
import {get} from "lodash-es";

export const isCamera = (value: unknown): value is THREE.Camera => {
    return get(value, 'isCamera') === true;
}


        