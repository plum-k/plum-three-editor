import * as THREE from "three";
import {get} from "lodash-es";

export const isQuaternion = (value: unknown): value is THREE.Quaternion => {
    return get(value, 'isQuaternion') === true;
}


        