import {
    BackSide,
    Camera,
    Color,
    ColorRepresentation,
    Material,
    Mesh,
    Plane,
    PlaneGeometry,
    ShaderMaterial,
    Side,
    Uniform,
    Vector3
} from "three";
import {shaderMaterial, version} from "../tool";

export type GridMaterialType = {
    /** Cell size, default: 0.5 */
    cellSize?: number
    /** Cell thickness, default: 0.5 */
    cellThickness?: number
    /** Cell color, default: black */
    cellColor?: ColorRepresentation
    /** Section size, default: 1 */
    sectionSize?: number
    /** Section thickness, default: 1 */
    sectionThickness?: number
    /** Section color, default: #2080ff */
    sectionColor?: ColorRepresentation
    /** Follow camera, default: false */
    followCamera?: boolean
    /** Display the grid infinitely, default: false */
    infiniteGrid?: boolean
    /** Fade distance, default: 100 */
    fadeDistance?: number
    /** Fade strength, default: 1 */
    fadeStrength?: number
    /** Fade from camera (1) or origin (0), or somewhere in between, default: camera */
    fadeFrom?: number;
    /** Material side, default: BackSide */
    side?: Side
}
export type GridProps = GridMaterialType & {
    args?: ConstructorParameters<typeof PlaneGeometry>
}
const GridMaterial = shaderMaterial(
    {
        cellSize: 0.5,
        sectionSize: 1,
        fadeDistance: 100,
        fadeStrength: 1,
        fadeFrom: 1,
        cellThickness: 0.5,
        sectionThickness: 1,
        cellColor: /* @__PURE__ */ new Color(),
        sectionColor: /* @__PURE__ */ new Color(),
        infiniteGrid: false,
        followCamera: false,
        worldCamProjPosition: /* @__PURE__ */ new Vector3(),
        worldPlanePosition: /* @__PURE__ */ new Vector3(),
    },
    /* glsl */ `
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform vec3 worldPlanePosition;
    uniform float fadeDistance;
    uniform bool infiniteGrid;
    uniform bool followCamera;

    void main() {
      localPosition = position.xzy;
      if (infiniteGrid) localPosition *= 1.0 + fadeDistance;
      
      worldPosition = modelMatrix * vec4(localPosition, 1.0);
      if (followCamera) {
        worldPosition.xyz += (worldCamProjPosition - worldPlanePosition);
        localPosition = (inverse(modelMatrix) * worldPosition).xyz;
      }

      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
    /* glsl */ `
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform float cellSize;
    uniform float sectionSize;
    uniform vec3 cellColor;
    uniform vec3 sectionColor;
    uniform float fadeDistance;
    uniform float fadeStrength;
    uniform float fadeFrom;
    uniform float cellThickness;
    uniform float sectionThickness;

    float getGrid(float size, float thickness) {
      vec2 r = localPosition.xz / size;
      vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
      float line = min(grid.x, grid.y) + 1.0 - thickness;
      return 1.0 - min(line, 1.0);
    }

    void main() {
      float g1 = getGrid(cellSize, cellThickness);
      float g2 = getGrid(sectionSize, sectionThickness);

      vec3 from = worldCamProjPosition*vec3(fadeFrom);
      float dist = distance(from, worldPosition.xyz);
      float d = 1.0 - min(dist / fadeDistance, 1.0);
      vec3 color = mix(cellColor, sectionColor, min(1.0, sectionThickness * g2));

      gl_FragColor = vec4(color, (g1 + g2) * pow(d, fadeStrength));
      gl_FragColor.a = mix(0.75 * gl_FragColor.a, gl_FragColor.a, g2);
      if (gl_FragColor.a <= 0.0) discard;

      #include <tonemapping_fragment>
      #include <${version >= 154 ? 'colorspace_fragment' : 'encodings_fragment'}>
    }
  `
)

export class Grid extends Mesh {
    plane = new Plane()
    upVector = new Vector3(0, 1, 0)
    zeroVector = new Vector3(0, 0, 0)

    constructor({
                    args,
                    cellColor = new Color('#6f6f6f'),
                    sectionColor = new Color('#9d4b4b'),
                    cellSize = 0.5,
                    sectionSize = 1,
                    followCamera = false,
                    infiniteGrid = false,
                    fadeDistance = 100,
                    fadeStrength = 1,
                    fadeFrom = 1,
                    cellThickness = 0.5,
                    sectionThickness = 1,
                    side = BackSide,
                }: GridProps) {
        const uniforms1 = {cellSize, sectionSize, cellColor, sectionColor, cellThickness, sectionThickness}
        const uniforms2 = {fadeDistance, fadeStrength, fadeFrom, infiniteGrid, followCamera}

        // todo 对外暴露
        const geometry = new PlaneGeometry(100, 100, 1, 1);

        // @ts-ignore
        const material = new GridMaterial();

        material.side = side;
        material.transparent = true;

        Object.assign(material, uniforms1);
        Object.assign(material, uniforms2);

        super(geometry, material as unknown as Material);
        this.frustumCulled = false;
    }

    // 更新
    tick(camera: Camera) {
        this.plane.setFromNormalAndCoplanarPoint(this.upVector, this.zeroVector).applyMatrix4(this.matrixWorld)
        const gridMaterial = this.material as ShaderMaterial
        const worldCamProjPosition = gridMaterial.uniforms.worldCamProjPosition as Uniform<Vector3>
        const worldPlanePosition = gridMaterial.uniforms.worldPlanePosition as Uniform<Vector3>
        // todo 获取相机
        this.plane.projectPoint(camera.position, worldCamProjPosition.value)
        worldPlanePosition.value.set(0, 0, 0).applyMatrix4(this.matrixWorld)
    }

    dispose() {
        this.geometry.dispose();
        (this.material as Material).dispose();
    }
}