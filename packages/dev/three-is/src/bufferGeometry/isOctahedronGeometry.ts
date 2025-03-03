import * as THREE from "three";
import {get} from "lodash-es";

export const isOctahedronGeometry = (value: unknown): value is THREE.OctahedronGeometry => {
  return get(value, 'type') === 'OctahedronGeometry';
}
