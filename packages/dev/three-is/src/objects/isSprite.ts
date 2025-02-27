import * as THREE from "three";
import {get} from "lodash-es";

export const isSprite = (value: unknown): value is THREE.Sprite => {
    return get(value, 'isSprite') === true;
}


        