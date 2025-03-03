import * as THREE from "three";
import {get} from "lodash-es";

export const isShapeGeometry = (value: unknown): value is THREE.ShapeGeometry => {
  return get(value, 'type') === 'ShapeGeometry';
}
