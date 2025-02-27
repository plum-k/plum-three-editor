import * as THREE from "three";
import {get} from "lodash-es";

export const isLightProbe = (value: unknown): value is THREE.LightProbe => {
    return get(value, 'isLightProbe') === true;
}


        