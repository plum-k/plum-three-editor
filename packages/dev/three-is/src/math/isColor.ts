import * as THREE from "three";
import {get} from "lodash-es";

export const isColor = (value: unknown): value is THREE.Color => {
    return get(value, 'isColor') === true;
}


        