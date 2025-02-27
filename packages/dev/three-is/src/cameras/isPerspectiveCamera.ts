import * as THREE from "three";
import {get} from "lodash-es";

export const isPerspectiveCamera = (value: unknown): value is THREE.PerspectiveCamera => {
    return get(value, 'isPerspectiveCamera') === true;
}

