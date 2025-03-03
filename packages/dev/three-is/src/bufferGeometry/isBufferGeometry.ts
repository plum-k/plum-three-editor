import * as THREE from "three";
import {get} from "lodash-es";

export const isBufferGeometry = (value: unknown): value is THREE.BufferGeometry => {
  return get(value, 'type') === 'BufferGeometry';
}
