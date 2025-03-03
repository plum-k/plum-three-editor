import * as THREE from "three";
import {get} from "lodash-es";

export const isBoxGeometry = (value: unknown): value is THREE.BoxGeometry => {
  return get(value, 'type') === 'BoxGeometry';
}
