
import * as THREE from "three";
import {get} from "lodash-es";

export const isObject3D = (value: unknown): value is THREE.Object3D => {
    return get(value, 'isObject3D') === true;
}


