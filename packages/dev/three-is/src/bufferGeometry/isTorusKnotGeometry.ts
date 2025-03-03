import * as THREE from "three";
import {get} from "lodash-es";

export const isTorusKnotGeometry = (value: unknown): value is THREE.TorusKnotGeometry => {
  return get(value, 'type') === 'TorusKnotGeometry';
}
