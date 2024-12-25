import * as THREE from "three";
import {get} from "lodash-es";

const isCameraHelper = (value: unknown): value is THREE.CameraHelper => {
    return get(value, 'isCameraHelper') === true;
}

export default isCameraHelper;
        