import * as THREE from "three";
import {get} from "lodash-es";

export const isShadowMaterial = (value: unknown): value is THREE.ShadowMaterial => {
    return get(value, 'isShadowMaterial') === true;
}


        