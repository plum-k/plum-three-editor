import * as THREE from "three";
import {get} from "lodash-es";

const isRawShaderMaterial = (value: unknown): value is THREE.RawShaderMaterial => {
    return get(value, 'isRawShaderMaterial') === true;
}

export default isRawShaderMaterial;
        