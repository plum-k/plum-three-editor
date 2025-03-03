import * as THREE from "three";
import {get} from "lodash-es";

export const isTorusGeometry = (value: unknown): value is THREE.TorusGeometry => {
  return get(value, 'type') === 'TorusGeometry';
}
