# three-is

在 typescript 使用 three.js 时的类型守卫

```ts
import {isOrthographicCamera, isPerspectiveCamera} from "three-is";
import * as THREE from "three";

const camera: THREE.PerspectiveCamera | THREE.OrthographicCamera = new THREE.OrthographicCamera()

if (isOrthographicCamera(camera)) {
    // 为正交
} else if (isPerspectiveCamera(camera)) {
    // 为透视
}
```
