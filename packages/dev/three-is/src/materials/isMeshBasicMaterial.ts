import * as THREE from "three";
import {get} from "lodash-es";

export const isMeshBasicMaterial = (value: unknown): value is THREE.MeshBasicMaterial => {
    return get(value, 'isMeshBasicMaterial') === true;
}


        