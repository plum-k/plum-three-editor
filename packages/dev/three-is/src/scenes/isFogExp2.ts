import * as THREE from "three";
import {get} from "lodash-es";

const isFogExp2 = (value: unknown): value is THREE.FogExp2 => {
    return get(value, 'isFogExp2') === true;
}

export default isFogExp2;
        