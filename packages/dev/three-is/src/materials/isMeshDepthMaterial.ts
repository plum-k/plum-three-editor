import * as THREE from "three";
import {get} from "lodash-es";

export const isMeshDepthMaterial = (value: unknown): value is THREE.MeshDepthMaterial => {
    return get(value, 'isMeshDepthMaterial') === true;
}


        