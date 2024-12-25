import * as THREE from "three";
import {get} from "lodash-es";

const isQuaternion = (value: unknown): value is THREE.Quaternion => {
    return get(value, 'isQuaternion') === true;
}

export default isQuaternion;
        