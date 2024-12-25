import * as THREE from "three";
import {get, isNil} from "lodash-es";

const isVector3 = (value: unknown | undefined | null): value is THREE.Vector3 => {
    return !isNil(value) && get(value, 'isVector3') === true;
}

export default isVector3;


