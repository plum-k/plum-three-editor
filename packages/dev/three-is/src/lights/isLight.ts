import * as THREE from "three";
import {get} from "lodash-es";

const isLight = (value: unknown): value is THREE.Light => {
    return get(value, 'isLight') === true;
}

export default isLight;
        