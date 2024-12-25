import * as THREE from "three";
import {get} from "lodash-es";

const isArrowHelper = (value: unknown): value is THREE.ArrowHelper => {
    return get(value, 'isArrowHelper') === true;
}

export default isArrowHelper;
        