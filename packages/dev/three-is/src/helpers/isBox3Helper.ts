import * as THREE from "three";
import {get} from "lodash-es";

export const isBox3Helper = (value: unknown): value is THREE.Box3Helper => {
    return get(value, 'isBox3Helper') === true;
}


        