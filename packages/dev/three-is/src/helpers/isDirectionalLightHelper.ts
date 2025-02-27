import * as THREE from "three";
import {get} from "lodash-es";

export const isDirectionalLightHelper = (value: unknown): value is THREE.DirectionalLightHelper => {
    return get(value, 'isDirectionalLightHelper') === true;
}


        