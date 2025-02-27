import * as THREE from "three";
import {get} from "lodash-es";

export const isMeshPhysicalMaterial = (value: unknown): value is THREE.MeshPhysicalMaterial => {
    return get(value, 'isMeshPhysicalMaterial') === true;
}


        