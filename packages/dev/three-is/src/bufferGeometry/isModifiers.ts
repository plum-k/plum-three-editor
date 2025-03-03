import * as THREE from "three";
import {get} from "lodash-es";

export const isModifiers = (value: unknown): value is THREE.Modifiers => {
  return get(value, 'type') === 'Modifiers';
}
