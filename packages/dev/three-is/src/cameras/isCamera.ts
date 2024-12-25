import * as THREE from "three";
import {get} from "lodash-es";

const isCamera = (value: unknown): value is THREE.Camera => {
    return get(value, 'isCamera') === true;
}

export default isCamera;
        