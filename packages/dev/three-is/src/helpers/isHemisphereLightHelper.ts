import * as THREE from "three";
import {get} from "lodash-es";

export const isHemisphereLightHelper = (value: unknown): value is THREE.HemisphereLightHelper => {
    return get(value, 'isHemisphereLightHelper') === true;
}


        