import * as THREE from "three";
import {get} from "lodash-es";

export const isFogExp2 = (value: unknown): value is THREE.FogExp2 => {
    return get(value, 'isFogExp2') === true;
}


        