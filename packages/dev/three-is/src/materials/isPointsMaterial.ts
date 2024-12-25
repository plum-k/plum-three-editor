import * as THREE from "three";
import {get} from "lodash-es";

const isPointsMaterial = (value: unknown): value is THREE.PointsMaterial => {
    return get(value, 'isPointsMaterial') === true;
}

export default isPointsMaterial;
        