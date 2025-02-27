import * as THREE from "three";
import {get} from "lodash-es";

export const isSpriteMaterial = (value: unknown): value is THREE.SpriteMaterial => {
    return get(value, 'isSpriteMaterial') === true;
}


        