import * as THREE from "three";
import {get} from "lodash-es";

export const isVector2 = (value: unknown): value is THREE.Vector2 => {
    return get(value, 'isVector2') === true;
}


        