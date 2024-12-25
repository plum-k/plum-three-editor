import * as THREE from "three";
import {get} from "lodash-es";

const isShaderMaterial = (value: unknown): value is THREE.ShaderMaterial => {
    return get(value, 'isShaderMaterial') === true;
}

export default isShaderMaterial;
        