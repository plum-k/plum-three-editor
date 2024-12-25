import * as THREE from "three";
import {get} from "lodash-es";

const isSpotLightHelper = (value: unknown): value is THREE.SpotLightHelper => {
    return get(value, 'isSpotLightHelper') === true;
}

export default isSpotLightHelper;
        