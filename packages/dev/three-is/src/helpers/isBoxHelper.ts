import * as THREE from "three";
import {get} from "lodash-es";

const isBoxHelper = (value: unknown): value is THREE.BoxHelper => {
    return get(value, 'isBoxHelper') === true;
}

export default isBoxHelper;
        