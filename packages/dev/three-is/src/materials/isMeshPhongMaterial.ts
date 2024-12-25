import * as THREE from "three";
import {get} from "lodash-es";

const isMeshPhongMaterial = (value: unknown): value is THREE.MeshPhongMaterial => {
    return get(value, 'isMeshPhongMaterial') === true;
}

export default isMeshPhongMaterial;
        