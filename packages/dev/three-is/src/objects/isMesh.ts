import * as THREE from "three";
import {get} from "lodash-es";

const isMesh = (value: unknown): value is THREE.Mesh => {
    return get(value, 'isMesh') === true;
}

export default isMesh;
        