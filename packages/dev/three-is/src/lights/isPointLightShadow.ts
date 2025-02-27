import * as THREE from "three";
import {get} from "lodash-es";

export const isPointLightShadow = (value: unknown): value is THREE.PointLightShadow => {
    return get(value, 'isPointLightShadow') === true;
}


        