import * as THREE from "three";
import {get} from "lodash-es";

const isPolarGridHelper = (value: unknown): value is THREE.PolarGridHelper => {
    return get(value, 'isPolarGridHelper') === true;
}

export default isPolarGridHelper;
        