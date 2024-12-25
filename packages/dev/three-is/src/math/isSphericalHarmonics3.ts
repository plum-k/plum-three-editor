import * as THREE from "three";
import {get} from "lodash-es";

const isSphericalHarmonics3 = (value: unknown): value is THREE.SphericalHarmonics3 => {
    return get(value, 'isSphericalHarmonics3') === true;
}

export default isSphericalHarmonics3;
        