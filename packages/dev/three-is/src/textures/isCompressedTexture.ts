import * as THREE from "three";
import {get} from "lodash-es";

export const isCompressedTexture = (value: unknown): value is THREE.CompressedTexture => {
    return get(value, 'isCompressedTexture') === true;
}


        