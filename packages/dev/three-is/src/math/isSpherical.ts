import * as THREE from "three";
import {get} from "lodash-es";

const isSpherical = (value: unknown): value is THREE.Spherical => {
    return get(value, 'isSpherical') === true;
}

export default isSpherical;
        