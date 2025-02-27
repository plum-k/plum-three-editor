import * as THREE from "three";
import {get} from "lodash-es";

export const isSphere = (value: unknown): value is THREE.Sphere => {
    return get(value, 'isSphere') === true;
}


        