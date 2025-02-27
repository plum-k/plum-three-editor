import * as THREE from "three";
import {get, isNil} from "lodash-es";

export const isVector3 = (value: unknown | undefined | null): value is THREE.Vector3 => {
    return !isNil(value) && get(value, 'isVector3') === true;
}




