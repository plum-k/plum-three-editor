import * as THREE from "three"
import {Sky} from "three/examples/jsm/objects/Sky.js";

export interface IPlumSkyProps {
    distance?: number
    sunPosition?: THREE.Vector3
    inclination?: number
    azimuth?: number
    mieCoefficient?: number
    mieDirectionalG?: number
    rayleigh?: number
    turbidity?: number
}

// 计算太阳位置
export function calcPosFromAngles(inclination: number, azimuth: number, vector: THREE.Vector3 = new THREE.Vector3()) {
    const theta = Math.PI * (inclination - 0.5)
    const phi = 2 * Math.PI * (azimuth - 0.5)

    vector.x = Math.cos(phi)
    vector.y = Math.sin(theta)
    vector.z = Math.sin(phi)

    return vector
}

export class PlumSky extends Sky {
    updateConfig({
                     inclination = 0.6,
                     azimuth = 0.1,
                     distance = 1000,
                     mieCoefficient = 0.005,
                     mieDirectionalG = 0.8,
                     rayleigh = 0.5,
                     turbidity = 10,
                     sunPosition = calcPosFromAngles(inclination, azimuth),
                 }: IPlumSkyProps) {
        const scale = new THREE.Vector3().setScalar(distance)

        this.material.uniforms.turbidity.value = turbidity
        this.material.uniforms.mieCoefficient.value = mieCoefficient
        this.material.uniforms.mieDirectionalG.value = mieDirectionalG
        this.material.uniforms.rayleigh.value = rayleigh
        this.material.uniforms.sunPosition.value = sunPosition
        this.material.uniforms.turbidity.value = turbidity
    }
}