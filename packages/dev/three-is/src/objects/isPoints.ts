import * as THREE from "three";
import {get} from "lodash-es";

export const isPoints = (value: unknown): value is THREE.Points => {
    return get(value, 'isPoints') === true;
}


        