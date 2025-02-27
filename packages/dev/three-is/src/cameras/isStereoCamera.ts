import * as THREE from "three";
import {get} from "lodash-es";

export const isStereoCamera = (value: unknown): value is THREE.StereoCamera => {
    return get(value, 'isStereoCamera') === true;
}


        