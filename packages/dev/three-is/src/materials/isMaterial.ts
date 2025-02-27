import * as THREE from "three";
import {get} from "lodash-es";

export const isMaterial = (value: unknown): value is THREE.Material => {
    return get(value, 'isMaterial') === true;
}


        