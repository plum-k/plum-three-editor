import * as THREE from "three";
import {get} from "lodash-es";

export const isInstancedMesh = (value: unknown): value is THREE.InstancedMesh => {
    return get(value, 'isInstancedMesh') === true;
}


        