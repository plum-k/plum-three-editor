import * as THREE from "three";
import {get} from "lodash-es";

export const isCylinderGeometry = (value: unknown): value is THREE.CylinderGeometry => {
  return get(value, 'type') === 'CylinderGeometry';
}
