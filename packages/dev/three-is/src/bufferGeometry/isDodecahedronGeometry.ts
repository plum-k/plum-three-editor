import * as THREE from "three";
import {get} from "lodash-es";

export const isDodecahedronGeometry = (value: unknown): value is THREE.DodecahedronGeometry => {
  return get(value, 'type') === 'DodecahedronGeometry';
}
