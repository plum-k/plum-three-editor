import * as THREE from "three";
import {get} from "lodash-es";

const isPlane = (value: unknown): value is THREE.Plane => {
    return get(value, 'isPlane') === true;
}

export default isPlane;
        