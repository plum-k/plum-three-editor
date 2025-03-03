import * as THREE from "three";
import {get} from "lodash-es";

export const isCapsuleGeometry = (value: unknown): value is THREE.CapsuleGeometry => {
  return get(value, 'type') === 'CapsuleGeometry';
}
