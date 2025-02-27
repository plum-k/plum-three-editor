import * as THREE from "three";
import {get} from "lodash-es";

export const isRawShaderMaterial = (value: unknown): value is THREE.RawShaderMaterial => {
    return get(value, 'isRawShaderMaterial') === true;
}


        