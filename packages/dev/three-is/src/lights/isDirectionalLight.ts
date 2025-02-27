import * as THREE from "three";
import {get} from "lodash-es";

export const isDirectionalLight = (value: unknown): value is THREE.DirectionalLight => {
    return get(value, 'isDirectionalLight') === true;
}


        