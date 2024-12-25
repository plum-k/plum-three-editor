import * as THREE from "three";
import {get} from "lodash-es";

const isDepthTexture = (value: unknown): value is THREE.DepthTexture => {
    return get(value, 'isDepthTexture') === true;
}

export default isDepthTexture;
        