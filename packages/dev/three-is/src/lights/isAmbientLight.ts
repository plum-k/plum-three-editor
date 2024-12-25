import * as THREE from "three";
import {get} from "lodash-es";

const isAmbientLight = (value: unknown): value is THREE.AmbientLight => {
    return get(value, 'isAmbientLight') === true;
}

export default isAmbientLight;
        