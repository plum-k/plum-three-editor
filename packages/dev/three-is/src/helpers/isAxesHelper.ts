import * as THREE from "three";
import {get} from "lodash-es";

const isAxesHelper = (value: unknown): value is THREE.AxesHelper => {
    return get(value, 'isAxesHelper') === true;
}

export default isAxesHelper;
        