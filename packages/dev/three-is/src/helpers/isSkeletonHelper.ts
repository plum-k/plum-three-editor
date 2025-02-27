import * as THREE from "three";
import {get} from "lodash-es";

export const isSkeletonHelper = (value: unknown): value is THREE.SkeletonHelper => {
    return get(value, 'isSkeletonHelper') === true;
}


        