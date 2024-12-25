import * as THREE from "three";
import {get} from "lodash-es";

const isInterpolant = (value: unknown): value is THREE.Interpolant => {
    return get(value, 'isInterpolant') === true;
}

export default isInterpolant;
        