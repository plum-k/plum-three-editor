import * as THREE from "three";
import {get} from "lodash-es";

export const isCylindrical = (value: unknown): value is THREE.Cylindrical => {
    return get(value, 'isCylindrical') === true;
}


        