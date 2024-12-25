import * as THREE from "three";
import {get} from "lodash-es";

const isVector2 = (value: unknown): value is THREE.Vector2 => {
    return get(value, 'isVector2') === true;
}

export default isVector2;
        