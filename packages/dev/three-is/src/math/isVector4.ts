import * as THREE from "three";
import {get} from "lodash-es";

export const isVector4 = (value: unknown): value is THREE.Vector4 => {
    return get(value, 'isVector4') === true;
}


        