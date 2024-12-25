import * as THREE from "three";
import {get} from "lodash-es";

const isHemisphereLight = (value: unknown): value is THREE.HemisphereLight => {
    return get(value, 'isHemisphereLight') === true;
}

export default isHemisphereLight;
        