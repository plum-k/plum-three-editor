import * as THREE from "three";
import {get} from "lodash-es";

export const isOrthographicCamera = (value: unknown): value is THREE.OrthographicCamera => {
    return get(value, 'isOrthographicCamera') === true;
}


        