import * as THREE from "three";
import {get} from "lodash-es";

const isLineSegments = (value: unknown): value is THREE.LineSegments => {
    return get(value, 'isLineSegments') === true;
}

export default isLineSegments;
        