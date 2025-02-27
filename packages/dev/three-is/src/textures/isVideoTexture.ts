import * as THREE from "three";
import {get} from "lodash-es";

export const isVideoTexture = (value: unknown): value is THREE.VideoTexture => {
    return get(value, 'isVideoTexture') === true;
}


        