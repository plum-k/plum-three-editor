import * as THREE from "three";
import {get} from "lodash-es";

export const isPointsMaterial = (value: unknown): value is THREE.PointsMaterial => {
    return get(value, 'isPointsMaterial') === true;
}


        