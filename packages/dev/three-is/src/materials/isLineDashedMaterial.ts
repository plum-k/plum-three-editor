import * as THREE from "three";
import {get} from "lodash-es";

export const isLineDashedMaterial = (value: unknown): value is THREE.LineDashedMaterial => {
    return get(value, 'isLineDashedMaterial') === true;
}


        