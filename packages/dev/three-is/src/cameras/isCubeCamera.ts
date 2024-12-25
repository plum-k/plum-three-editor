import * as THREE from "three";
import {get} from "lodash-es";

const isCubeCamera = (value: unknown): value is THREE.CubeCamera => {
    return get(value, 'isCubeCamera') === true;
}

export default isCubeCamera;
        