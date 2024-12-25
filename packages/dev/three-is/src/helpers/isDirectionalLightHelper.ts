import * as THREE from "three";
import {get} from "lodash-es";

const isDirectionalLightHelper = (value: unknown): value is THREE.DirectionalLightHelper => {
    return get(value, 'isDirectionalLightHelper') === true;
}

export default isDirectionalLightHelper;
        