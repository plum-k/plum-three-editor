import * as THREE from "three";
import {get} from "lodash-es";

export const isTriangle = (value: unknown): value is THREE.Triangle => {
    return get(value, 'isTriangle') === true;
}


        