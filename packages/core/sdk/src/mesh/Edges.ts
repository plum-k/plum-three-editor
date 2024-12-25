import * as  THREE from "three";
import {LineSegments2} from "three/examples/jsm/lines/LineSegments2";

export default class Edges {

    constructor({
                    explicitGeometry
                }) {
        let threshold = 15
        let tmpPoints = [0, 0, 0, 1, 0, 0]
        let memoizedGeometry: THREE.BufferGeometry | undefined = undefined
        let memoizedThreshold = 0

        let parent!: THREE.Mesh;
        let geometry = explicitGeometry ?? parent?.geometry
        if (!geometry) return

        let cached = memoizedGeometry === geometry && memoizedThreshold === threshold
        if (cached) return

        memoizedGeometry = geometry
        memoizedThreshold = threshold

        let points = (new THREE.EdgesGeometry(geometry, threshold).attributes.position as THREE.BufferAttribute)
            .array as Float32Array

        let lineSegments2 = new LineSegments2()

        lineSegments2.geometry.setPositions(points)
        lineSegments2.geometry.attributes.instanceStart.needsUpdate = true
        lineSegments2.geometry.attributes.instanceEnd.needsUpdate = true
        lineSegments2.computeLineDistances()
    }
}