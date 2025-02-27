import * as THREE from "three";
import {get} from "lodash-es";

export const isScene = (value: unknown): value is THREE.Scene => {
    return get(value, 'isScene') === true;
}


        