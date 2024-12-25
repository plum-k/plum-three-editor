import * as THREE from "three";
import {get} from "lodash-es";

const isPlaneHelper = (value: unknown): value is THREE.PlaneHelper => {
    return get(value, 'isPlaneHelper') === true;
}

export default isPlaneHelper;
        