import * as THREE from "three";
import {get} from "lodash-es";

export const isGroup = (value: unknown): value is THREE.Group => {
    return get(value, 'isGroup') === true;
}


        