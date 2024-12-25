import * as THREE from "three";
import {get} from "lodash-es";

const isHemisphereLightProbe = (value: unknown): value is THREE.HemisphereLightProbe => {
    return get(value, 'isHemisphereLightProbe') === true;
}

export default isHemisphereLightProbe;
