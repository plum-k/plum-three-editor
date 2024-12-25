import * as THREE from "three";
import {get} from "lodash-es";

const isVector4 = (value: unknown): value is THREE.Vector4 => {
    return get(value, 'isVector4') === true;
}

export default isVector4;
        