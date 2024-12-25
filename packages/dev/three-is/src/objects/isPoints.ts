import * as THREE from "three";
import {get} from "lodash-es";

const isPoints = (value: unknown): value is THREE.Points => {
    return get(value, 'isPoints') === true;
}

export default isPoints;
        