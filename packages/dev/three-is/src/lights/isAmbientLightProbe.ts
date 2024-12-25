import * as THREE from "three";
import {get} from "lodash-es";

const isAmbientLightProbe = (value: unknown): value is THREE.AmbientLightProbe => {
    return get(value, 'isAmbientLightProbe') === true;
}

export default isAmbientLightProbe;
        