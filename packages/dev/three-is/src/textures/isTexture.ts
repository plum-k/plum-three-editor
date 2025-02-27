import * as THREE from "three";
import {get} from "lodash-es";

export const isTexture = (value: unknown): value is THREE.Texture => {
    return get(value, 'isTexture') === true;
}


        