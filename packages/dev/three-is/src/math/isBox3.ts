import * as THREE from "three";
import {get} from "lodash-es";

export const isBox3 = (value: unknown): value is THREE.Box3 => {
    return get(value, 'isBox3') === true;
}


        