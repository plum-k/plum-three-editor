import * as THREE from "three";
import {get} from "lodash-es";

export const isSpotLight = (value: unknown): value is THREE.SpotLight => {
    return get(value, 'isSpotLight') === true;
}


        