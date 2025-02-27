import * as THREE from "three";
import {get} from "lodash-es";

export const isSkeleton = (value: unknown): value is THREE.Skeleton => {
    return get(value, 'isSkeleton') === true;
}


        