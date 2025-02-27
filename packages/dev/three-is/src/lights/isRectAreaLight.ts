import * as THREE from "three";
import {get} from "lodash-es";

export const isRectAreaLight = (value: unknown): value is THREE.RectAreaLight => {
    return get(value, 'isRectAreaLight') === true;
}


        