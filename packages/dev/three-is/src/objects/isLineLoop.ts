import * as THREE from "three";
import {get} from "lodash-es";

const isLineLoop = (value: unknown): value is THREE.LineLoop => {
    return get(value, 'isLineLoop') === true;
}

export default isLineLoop;
        