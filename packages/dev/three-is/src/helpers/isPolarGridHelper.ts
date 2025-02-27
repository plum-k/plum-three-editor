import * as THREE from "three";
import {get} from "lodash-es";

export const isPolarGridHelper = (value: unknown): value is THREE.PolarGridHelper => {
    return get(value, 'isPolarGridHelper') === true;
}


        