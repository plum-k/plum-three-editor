import * as THREE from "three";
import {get} from "lodash-es";

export const isMesh = (value: unknown): value is THREE.Mesh => {
    return get(value, 'isMesh') === true;
}


        