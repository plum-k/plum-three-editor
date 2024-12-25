import * as THREE from "three";
import {get} from "lodash-es";

const isPointLightHelper = (value: unknown): value is THREE.PointLightHelper => {
    return get(value, 'isPointLightHelper') === true;
}

export default isPointLightHelper;
        