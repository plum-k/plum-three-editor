import * as THREE from "three";
import {get} from "lodash-es";

export const isExtrudeGeometry = (value: unknown): value is THREE.ExtrudeGeometry => {
  return get(value, 'type') === 'ExtrudeGeometry';
}
