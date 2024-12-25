import * as THREE from "three";
import {get} from "lodash-es";

const isLineBasicMaterial = (value: unknown): value is THREE.LineBasicMaterial => {
    return get(value, 'isLineBasicMaterial') === true;
}

export default isLineBasicMaterial;
        