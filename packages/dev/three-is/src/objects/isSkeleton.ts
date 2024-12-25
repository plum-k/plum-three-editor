import * as THREE from "three";
import {get} from "lodash-es";

const isSkeleton = (value: unknown): value is THREE.Skeleton => {
    return get(value, 'isSkeleton') === true;
}

export default isSkeleton;
        