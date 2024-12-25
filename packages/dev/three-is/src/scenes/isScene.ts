import * as THREE from "three";
import {get} from "lodash-es";

const isScene = (value: unknown): value is THREE.Scene => {
    return get(value, 'isScene') === true;
}

export default isScene;
        