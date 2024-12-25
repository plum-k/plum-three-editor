import * as THREE from "three";
import {get} from "lodash-es";

const isTriangle = (value: unknown): value is THREE.Triangle => {
    return get(value, 'isTriangle') === true;
}

export default isTriangle;
        