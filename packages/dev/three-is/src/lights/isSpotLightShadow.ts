import * as THREE from "three";
import {get} from "lodash-es";

export const isSpotLightShadow = (value: unknown): value is THREE.SpotLightShadow => {
    return get(value, 'isSpotLightShadow') === true;
}


        