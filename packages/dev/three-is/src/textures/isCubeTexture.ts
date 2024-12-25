import * as THREE from "three";
import {get} from "lodash-es";

const isCubeTexture = (value: unknown): value is THREE.CubeTexture => {
    return get(value, 'isCubeTexture') === true;
}

export default isCubeTexture;
        