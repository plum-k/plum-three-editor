import * as THREE from "three";
import {get} from "lodash-es";

export const isSphereGeometry = (value: unknown): value is THREE.SphereGeometry => {
  return get(value, 'type') === 'SphereGeometry';
}
