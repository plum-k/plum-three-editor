import * as THREE from "three";
import {get} from "lodash-es";

export const isMeshDistanceMaterial = (value: unknown): value is THREE.MeshDistanceMaterial => {
    return get(value, 'isMeshDistanceMaterial') === true;
}


        