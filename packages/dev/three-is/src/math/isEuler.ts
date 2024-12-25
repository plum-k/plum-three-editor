import * as THREE from "three";
import {get} from "lodash-es";

const isEuler = (value: unknown): value is THREE.Euler => {
    return get(value, 'isEuler') === true;
}

export default isEuler;
        