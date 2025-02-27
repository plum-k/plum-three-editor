import * as THREE from "three";
import {get} from "lodash-es";

export const isGridHelper = (value: unknown): value is THREE.GridHelper => {
    return get(value, 'isGridHelper') === true;
}


        