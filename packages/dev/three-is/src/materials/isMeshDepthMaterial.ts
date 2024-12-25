import * as THREE from "three";
import {get} from "lodash-es";

const isMeshDepthMaterial = (value: unknown): value is THREE.MeshDepthMaterial => {
    return get(value, 'isMeshDepthMaterial') === true;
}

export default isMeshDepthMaterial;
        