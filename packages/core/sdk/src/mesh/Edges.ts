import {BufferAttribute, BufferGeometry, EdgesGeometry, Mesh} from "three";
import {LineSegments2} from "three/examples/jsm/lines/LineSegments2.js";

export class Edges {

    constructor({
                    explicitGeometry
                }) {
        let threshold = 15
        let tmpPoints = [0, 0, 0, 1, 0, 0]
        let memoizedGeometry: BufferGeometry | undefined = undefined
        let memoizedThreshold = 0

        let parent!: Mesh;
        let geometry = explicitGeometry ?? parent?.geometry
        if (!geometry) return

        let cached = memoizedGeometry === geometry && memoizedThreshold === threshold
        if (cached) return

        memoizedGeometry = geometry
        memoizedThreshold = threshold

        let points = (new EdgesGeometry(geometry, threshold).attributes.position as BufferAttribute)
            .array as Float32Array

        let lineSegments2 = new LineSegments2()

        lineSegments2.geometry.setPositions(points)
        lineSegments2.geometry.attributes.instanceStart.needsUpdate = true
        lineSegments2.geometry.attributes.instanceEnd.needsUpdate = true
        lineSegments2.computeLineDistances()
    }
}