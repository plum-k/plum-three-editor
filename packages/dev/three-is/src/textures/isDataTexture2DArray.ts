import * as THREE from "three";
import {get} from "lodash-es";

export const isDataTexture2DArray = (value: unknown): value is THREE.DataTexture2DArray => {
    return get(value, 'isDataTexture2DArray') === true;
}


        