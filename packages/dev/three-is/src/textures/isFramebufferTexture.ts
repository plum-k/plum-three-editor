import * as THREE from "three";
import {get} from "lodash-es";

const isFramebufferTexture = (value: unknown): value is THREE.FramebufferTexture => {
    return get(value, 'isFramebufferTexture') === true;
}

export default isFramebufferTexture;
        