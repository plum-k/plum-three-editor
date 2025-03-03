import * as THREE from "three";
import {get} from "lodash-es";

export const isTubeGeometry = (value: unknown): value is THREE.TubeGeometry => {
  return get(value, 'type') === 'TubeGeometry';
}
