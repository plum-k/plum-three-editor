import * as THREE from "three";
import {get} from "lodash-es";

export const isFog = (value: unknown): value is THREE.Fog => {
    return get(value, 'isFog') === true;
}


        