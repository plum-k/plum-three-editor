import * as THREE from "three";
import {get} from "lodash-es";

export const isCircleGeometry = (value: unknown): value is THREE.CircleGeometry => {
  return get(value, 'type') === 'CircleGeometry';
}
