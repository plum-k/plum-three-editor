
import {CubicBezierCurve3, QuadraticBezierCurve3, Vector3} from "three";
import {isVector3} from "three-is";

export interface IGetQuadraticBezierCurve3PointsOptions {
    quadraticBezierCurve3: QuadraticBezierCurve3;
    start: Vector3 | [number, number, number]
    end: Vector3 | [number, number, number]
    mid?: Vector3 | [number, number, number];
    segments?: number;
}

export interface IGetCubicBezierCurve3PointsOptions {
    cubicBezierCurve3: CubicBezierCurve3;
    start: Vector3 | [number, number, number]
    end: Vector3 | [number, number, number]
    midA: Vector3 | [number, number, number]
    midB: Vector3 | [number, number, number]
    segments?: number
}

const v = new Vector3()

export class LineTool {
    static getQuadraticBezierCurve3Points(options: IGetQuadraticBezierCurve3PointsOptions) {
        const {start, end, mid, quadraticBezierCurve3} = options;
        if (isVector3(start)) {
            quadraticBezierCurve3.v0.copy(start)
        } else {
            quadraticBezierCurve3.v0.set(...(start as [number, number, number]))
        }
        if (isVector3(end)) {
            quadraticBezierCurve3.v2.copy(end)

        } else {
            quadraticBezierCurve3.v2.set(...(end as [number, number, number]))
        }

        if (isVector3(mid)) {
            quadraticBezierCurve3.v1.copy(mid)
        } else if (Array.isArray(mid)) {
            quadraticBezierCurve3.v1.set(...(mid as [number, number, number]))
        } else {
            quadraticBezierCurve3.v1.copy(
                quadraticBezierCurve3.v0
                    .clone()
                    .add(quadraticBezierCurve3.v2.clone().sub(quadraticBezierCurve3.v0))
                    .add(v.set(0, quadraticBezierCurve3.v0.y - quadraticBezierCurve3.v2.y, 0))
            )
        }
        return quadraticBezierCurve3
    }

    static getCubicBezierCurve3Points(options: IGetCubicBezierCurve3PointsOptions) {
        const {start, end, midA, midB, cubicBezierCurve3} = options;
        if (isVector3(start)) {
            cubicBezierCurve3.v0.copy(start)
        } else {
            cubicBezierCurve3.v0.set(...(start as [number, number, number]))
        }
        if (isVector3(end)) {
            cubicBezierCurve3.v3.copy(end)
        } else {
            cubicBezierCurve3.v3.set(...(end as [number, number, number]))
        }
        if (isVector3(midA)) {
            cubicBezierCurve3.v1.copy(midA)
        } else {
            cubicBezierCurve3.v1.set(...(midA as [number, number, number]))
        }
        if (isVector3(midB)) {
            cubicBezierCurve3.v2.copy(midB)
        } else {
            cubicBezierCurve3.v2.set(...(midB as [number, number, number]))
        }
        return cubicBezierCurve3;

    }


}