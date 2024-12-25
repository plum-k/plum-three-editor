import * as THREE from "three";
import {get} from "lodash-es";

const isPerspectiveCamera = (value: unknown): value is THREE.PerspectiveCamera => {
    return get(value, 'isPerspectiveCamera') === true;
}

export default isPerspectiveCamera;