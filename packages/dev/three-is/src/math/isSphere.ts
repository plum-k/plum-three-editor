import * as THREE from "three";
import {get} from "lodash-es";

const isSphere = (value: unknown): value is THREE.Sphere => {
    return get(value, 'isSphere') === true;
}

export default isSphere;
        