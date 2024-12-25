import * as THREE from "three";
import {get} from "lodash-es";

const isBox2 = (value: unknown): value is THREE.Box2 => {
    return get(value, 'isBox2') === true;
}

export default isBox2;
        