import * as THREE from "three";
import {get} from "lodash-es";

const isShadowMaterial = (value: unknown): value is THREE.ShadowMaterial => {
    return get(value, 'isShadowMaterial') === true;
}

export default isShadowMaterial;
        