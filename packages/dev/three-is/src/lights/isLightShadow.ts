import * as THREE from "three";
import {get} from "lodash-es";

const isLightShadow = (value: unknown): value is THREE.LightShadow => {
    return get(value, 'isLightShadow') === true;
}

export default isLightShadow;
        