import * as THREE from "three";
import {get} from "lodash-es";

const isCanvasTexture = (value: unknown): value is THREE.CanvasTexture => {
    return get(value, 'isCanvasTexture') === true;
}

export default isCanvasTexture;
        