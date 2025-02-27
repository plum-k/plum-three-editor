import * as THREE from "three";
import {get} from "lodash-es";

export const isMeshNormalMaterial = (value: unknown): value is THREE.MeshNormalMaterial => {
    return get(value, 'isMeshNormalMaterial') === true;
}


        