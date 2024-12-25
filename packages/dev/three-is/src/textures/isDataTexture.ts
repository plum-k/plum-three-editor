import * as THREE from "three";
import {get} from "lodash-es";

const isDataTexture = (value: unknown): value is THREE.DataTexture => {
    return get(value, 'isDataTexture') === true;
}

export default isDataTexture;
        