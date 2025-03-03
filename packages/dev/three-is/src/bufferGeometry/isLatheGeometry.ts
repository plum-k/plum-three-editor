import * as THREE from "three";
import {get} from "lodash-es";

export const isLatheGeometry = (value: unknown): value is THREE.LatheGeometry => {
  return get(value, 'type') === 'LatheGeometry';
}
