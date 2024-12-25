import * as THREE from "three";
import {get} from "lodash-es";

const isPointLight = (value: unknown): value is THREE.PointLight => {
    return get(value, 'isPointLight') === true;
}

export default isPointLight;
        