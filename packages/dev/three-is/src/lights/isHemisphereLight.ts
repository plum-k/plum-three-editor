import * as THREE from "three";
import {get} from "lodash-es";

export const isHemisphereLight = (value: unknown): value is THREE.HemisphereLight => {
    return get(value, 'isHemisphereLight') === true;
}


        