import * as THREE from "three";
import {get} from "lodash-es";

const isLineDashedMaterial = (value: unknown): value is THREE.LineDashedMaterial => {
    return get(value, 'isLineDashedMaterial') === true;
}

export default isLineDashedMaterial;
        