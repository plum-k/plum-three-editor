import * as THREE from "three";
import {get} from "lodash-es";

export const isMeshLambertMaterial = (value: unknown): value is THREE.MeshLambertMaterial => {
    return get(value, 'isMeshLambertMaterial') === true;
}


        