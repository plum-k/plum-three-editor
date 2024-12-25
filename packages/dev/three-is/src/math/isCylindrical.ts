import * as THREE from "three";
import {get} from "lodash-es";

const isCylindrical = (value: unknown): value is THREE.Cylindrical => {
    return get(value, 'isCylindrical') === true;
}

export default isCylindrical;
        