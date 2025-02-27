import * as THREE from "three";
import {get} from "lodash-es";

export const isDataTexture = (value: unknown): value is THREE.DataTexture => {
    return get(value, 'isDataTexture') === true;
}


        