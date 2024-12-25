import * as THREE from "three";
import {get} from "lodash-es";

const isOrthographicCamera = (value: unknown): value is THREE.OrthographicCamera => {
    return get(value, 'isOrthographicCamera') === true;
}

export default isOrthographicCamera;
        