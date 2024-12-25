import * as THREE from "three";
import {get} from "lodash-es";

const isInstancedMesh = (value: unknown): value is THREE.InstancedMesh => {
    return get(value, 'isInstancedMesh') === true;
}

export default isInstancedMesh;
        