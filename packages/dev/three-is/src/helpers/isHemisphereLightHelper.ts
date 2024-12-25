import * as THREE from "three";
import {get} from "lodash-es";

const isHemisphereLightHelper = (value: unknown): value is THREE.HemisphereLightHelper => {
    return get(value, 'isHemisphereLightHelper') === true;
}

export default isHemisphereLightHelper;
        