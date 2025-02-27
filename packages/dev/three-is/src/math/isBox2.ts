import * as THREE from "three";
import {get} from "lodash-es";

export const isBox2 = (value: unknown): value is THREE.Box2 => {
    return get(value, 'isBox2') === true;
}


        