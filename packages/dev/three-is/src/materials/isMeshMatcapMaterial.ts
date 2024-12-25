import * as THREE from "three";
import {get} from "lodash-es";

const isMeshMatcapMaterial = (value: unknown): value is THREE.MeshMatcapMaterial => {
    return get(value, 'isMeshMatcapMaterial') === true;
}

export default isMeshMatcapMaterial;
        