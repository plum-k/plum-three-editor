import * as THREE from "three";
import {get} from "lodash-es";

export const isPlaneGeometry = (value: unknown): value is THREE.PlaneGeometry => {
  return get(value, 'type') === 'PlaneGeometry';
}
