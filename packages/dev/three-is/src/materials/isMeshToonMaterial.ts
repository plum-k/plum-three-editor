import * as THREE from "three";
import {get} from "lodash-es";

export const isMeshToonMaterial = (value: unknown): value is THREE.MeshToonMaterial => {
    return get(value, 'isMeshToonMaterial') === true;
}


        