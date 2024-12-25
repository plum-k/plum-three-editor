import * as THREE from "three";
import {get} from "lodash-es";

const isFrustum = (value: unknown): value is THREE.Frustum => {
    return get(value, 'isFrustum') === true;
}

export default isFrustum;
        