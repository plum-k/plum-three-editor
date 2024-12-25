import * as THREE from "three";
import {get} from "lodash-es";

const isPointLightShadow = (value: unknown): value is THREE.PointLightShadow => {
    return get(value, 'isPointLightShadow') === true;
}

export default isPointLightShadow;
        