import * as THREE from "three";
import {get} from "lodash-es";

const isSpriteMaterial = (value: unknown): value is THREE.SpriteMaterial => {
    return get(value, 'isSpriteMaterial') === true;
}

export default isSpriteMaterial;
        