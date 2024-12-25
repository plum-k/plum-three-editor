import * as THREE from "three";
import {get} from "lodash-es";

const isGridHelper = (value: unknown): value is THREE.GridHelper => {
    return get(value, 'isGridHelper') === true;
}

export default isGridHelper;
        