import * as THREE from "three";
import {get} from "lodash-es";

export const 文件名 = (value: unknown): value is THREE.文件名去除is => {
  return get(value, 'type') === '文件名去除is';
}


