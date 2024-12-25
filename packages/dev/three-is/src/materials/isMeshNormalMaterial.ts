import * as THREE from "three";
import {get} from "lodash-es";

const isMeshNormalMaterial = (value: unknown): value is THREE.MeshNormalMaterial => {
    return get(value, 'isMeshNormalMaterial') === true;
}

export default isMeshNormalMaterial;
        