import * as THREE from "three";
import {get} from "lodash-es";

const isSkinnedMesh = (value: unknown): value is THREE.SkinnedMesh => {
    return get(value, 'isSkinnedMesh') === true;
}

export default isSkinnedMesh;
        