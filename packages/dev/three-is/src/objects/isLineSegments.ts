import * as THREE from "three";
import {get} from "lodash-es";

export const isLineSegments = (value: unknown): value is THREE.LineSegments => {
    return get(value, 'isLineSegments') === true;
}


        