import * as THREE from "three";
import {get} from "lodash-es";

export const isTetrahedronGeometry = (value: unknown): value is THREE.TetrahedronGeometry => {
  return get(value, 'type') === 'TetrahedronGeometry';
}
