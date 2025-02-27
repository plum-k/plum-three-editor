import * as THREE from "three";
import {get} from "lodash-es";

export const isPlane = (value: unknown): value is THREE.Plane => {
    return get(value, 'isPlane') === true;
}


        