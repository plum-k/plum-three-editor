import * as THREE from "three";
import {get} from "lodash-es";

export const isAmbientLight = (value: unknown): value is THREE.AmbientLight => {
    return get(value, 'isAmbientLight') === true;
}


        