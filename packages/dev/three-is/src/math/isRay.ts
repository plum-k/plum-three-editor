import * as THREE from "three";
import {get} from "lodash-es";

const isRay = (value: unknown): value is THREE.Ray => {
    return get(value, 'isRay') === true;
}

export default isRay;
        