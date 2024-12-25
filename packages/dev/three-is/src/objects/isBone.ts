import * as THREE from "three";
import {get} from "lodash-es";

const isBone = (value: unknown): value is THREE.Bone => {
    return get(value, 'isBone') === true;
}

export default isBone;
        