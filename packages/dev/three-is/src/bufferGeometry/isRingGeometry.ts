import * as THREE from "three";
import {get} from "lodash-es";

export const isRingGeometry = (value: unknown): value is THREE.RingGeometry => {
  return get(value, 'type') === 'RingGeometry';
}
