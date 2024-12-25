import * as THREE from "three";
import {get} from "lodash-es";

const isMeshStandardMaterial = (value: unknown): value is THREE.MeshStandardMaterial => {
    return get(value, 'isMeshStandardMaterial') === true;
}

export default isMeshStandardMaterial;
        