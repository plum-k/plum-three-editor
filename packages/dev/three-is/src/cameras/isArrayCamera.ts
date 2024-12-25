import * as THREE from "three";
import {get} from "lodash-es";

const isArrayCamera = (value: unknown): value is THREE.ArrayCamera => {
    return get(value, 'isArrayCamera') === true;
}

export default isArrayCamera;
        