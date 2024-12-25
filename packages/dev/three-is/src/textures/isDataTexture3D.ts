import * as THREE from "three";
import {get} from "lodash-es";

const isDataTexture3D = (value: unknown): value is THREE.DataTexture3D => {
    return get(value, 'isDataTexture3D') === true;
}

export default isDataTexture3D;
        