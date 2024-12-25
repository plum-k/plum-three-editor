import * as THREE from "three";
import {get} from "lodash-es";

const isCompressedTexture = (value: unknown): value is THREE.CompressedTexture => {
    return get(value, 'isCompressedTexture') === true;
}

export default isCompressedTexture;
        