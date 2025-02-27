import * as THREE from "three";
import {get} from "lodash-es";

export const isBoxHelper = (value: unknown): value is THREE.BoxHelper => {
    return get(value, 'isBoxHelper') === true;
}


        