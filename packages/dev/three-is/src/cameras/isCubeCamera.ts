import * as THREE from "three";
import {get} from "lodash-es";

export const isCubeCamera = (value: unknown): value is THREE.CubeCamera => {
    return get(value, 'isCubeCamera') === true;
}


        