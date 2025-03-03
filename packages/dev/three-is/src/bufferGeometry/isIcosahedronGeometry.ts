import * as THREE from "three";
import {get} from "lodash-es";

export const isIcosahedronGeometry = (value: unknown): value is THREE.IcosahedronGeometry => {
  return get(value, 'type') === 'IcosahedronGeometry';
}
