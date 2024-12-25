import * as THREE from "three";
import {get} from "lodash-es";

const isDirectionalLightShadow = (value: unknown): value is THREE.DirectionalLightShadow => {
    return get(value, 'isDirectionalLightShadow') === true;
}

export default isDirectionalLightShadow;
        