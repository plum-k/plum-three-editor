import * as  THREE from "three";
import {toCreasedNormals} from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {shaderMaterial, version} from "../tool";

const material = /* @__PURE__ */ shaderMaterial(
    {
        screenspace: false,
        color: /* @__PURE__ */ new THREE.Color('black'),
        opacity: 1,
        thickness: 0.05,
        size: /* @__PURE__ */ new THREE.Vector2(),
    },
    `#include <common>
   #include <morphtarget_pars_vertex>
   #include <skinning_pars_vertex>
   uniform float thickness;
   uniform bool screenspace;
   uniform vec2 size;
   void main() {
     #if defined (USE_SKINNING)
	     #include <beginnormal_vertex>
       #include <morphnormal_vertex>
       #include <skinbase_vertex>
       #include <skinnormal_vertex>
       #include <defaultnormal_vertex>
     #endif
     #include <begin_vertex>
	   #include <morphtarget_vertex>
	   #include <skinning_vertex>
     #include <project_vertex>
     vec4 tNormal = vec4(normal, 0.0);
     vec4 tPosition = vec4(transformed, 1.0);
     #ifdef USE_INSTANCING
       tNormal = instanceMatrix * tNormal;
       tPosition = instanceMatrix * tPosition;
     #endif
     if (screenspace) {
       vec3 newPosition = tPosition.xyz + tNormal.xyz * thickness;
       gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0); 
     } else {
       vec4 clipPosition = projectionMatrix * modelViewMatrix * tPosition;
       vec4 clipNormal = projectionMatrix * modelViewMatrix * tNormal;
       vec2 offset = normalize(clipNormal.xy) * thickness / size * clipPosition.w * 2.0;
       clipPosition.xy += offset;
       gl_Position = clipPosition;
     }
   }`,
    `uniform vec3 color;
   uniform float opacity;
   void main(){
     gl_FragColor = vec4(color, opacity);
     #include <tonemapping_fragment>
     #include <${version >= 154 ? 'colorspace_fragment' : 'encodings_fragment'}>
   }`
)
type OutlinesProps = {
    /** Outline color, default: black */
    color?: THREE.Color
    /** Line thickness is independent of zoom, default: false */
    screenspace?: boolean
    /** Outline opacity, default: 1 */
    opacity?: number
    /** Outline transparency, default: false */
    transparent?: boolean
    /** Outline thickness, default 0.05 */
    thickness?: number
    /** Geometry crease angle (0 === no crease), default: Math.PI */
    angle?: number
    toneMapped?: boolean
    polygonOffset?: boolean
    polygonOffsetFactor?: number
    renderOrder?: number,
    size: THREE.Vector2
}

export class Outlines extends THREE.Group {
    oldAngle = 0;
    oldGeometry: THREE.BufferGeometry | undefined = undefined

    constructor() {
        super();
    }

    init({
             color = new THREE.Color("skyblue"),
             opacity = 1,
             transparent = false,
             screenspace = false,
             toneMapped = true,
             polygonOffset = false,
             polygonOffsetFactor = 0,
             renderOrder = 0,
             thickness = 0.05,
             angle = Math.PI,
             ...props
         }: OutlinesProps) {
        const parent = this.parent as THREE.Mesh & THREE.SkinnedMesh & THREE.InstancedMesh
        if (parent && parent.geometry) {
            if (this.oldAngle !== angle || this.oldGeometry !== parent.geometry) {
                this.oldAngle = angle
                this.oldGeometry = parent.geometry

                // Remove old mesh
                let mesh = this.children?.[0] as any
                if (mesh) {
                    if (angle) {
                        mesh.geometry.dispose()
                    }
                    this.remove(mesh)
                }

                if (parent.skeleton) {
                    mesh = new THREE.SkinnedMesh()
                    mesh.material = material
                    mesh.bind(parent.skeleton, parent.bindMatrix)
                    this.add(mesh)
                } else if (parent.isInstancedMesh) {
                    mesh = new THREE.InstancedMesh(parent.geometry, material, parent.count)
                    mesh.instanceMatrix = parent.instanceMatrix
                    this.add(mesh)
                } else {
                    mesh = new THREE.Mesh()
                    mesh.material = material
                    this.add(mesh)
                }
                mesh.geometry = angle ? toCreasedNormals(parent.geometry, angle) : parent.geometry
            }
        }
    }

    update({
               color = new THREE.Color("skyblue"),
               opacity = 1,
               transparent = false,
               screenspace = false,
               toneMapped = true,
               polygonOffset = false,
               polygonOffsetFactor = 0,
               renderOrder = 0,
               thickness = 0.05,
               angle = Math.PI,
               size = new THREE.Vector2()
           }: OutlinesProps) {
        const mesh = this.children[0] as THREE.Mesh<THREE.BufferGeometry, THREE.Material>
        if (mesh) {
            mesh.renderOrder = renderOrder;

            Object.assign(mesh.material, {
                transparent,
                thickness,
                color,
                opacity,
                size,
                screenspace,
                toneMapped,
                polygonOffset,
                polygonOffsetFactor,
            })
        }
    }

    // 更新
    tick() {

    }
}