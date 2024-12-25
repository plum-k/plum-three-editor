import * as THREE from "three";
import {get} from "lodash-es";

const isMatrix4 = (value: unknown): value is THREE.Matrix4 => {
    return get(value, 'isMatrix4') === true;
}

export default isMatrix4;
        