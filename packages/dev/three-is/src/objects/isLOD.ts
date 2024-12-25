import * as THREE from "three";
import {get} from "lodash-es";

const isLOD = (value: unknown): value is THREE.LOD => {
    return get(value, 'isLOD') === true;
}

export default isLOD;
        