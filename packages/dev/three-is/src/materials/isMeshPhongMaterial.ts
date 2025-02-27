import * as THREE from "three";
import {get} from "lodash-es";

export const isMeshPhongMaterial = (value: unknown): value is THREE.MeshPhongMaterial => {
    return get(value, 'isMeshPhongMaterial') === true;
}


        