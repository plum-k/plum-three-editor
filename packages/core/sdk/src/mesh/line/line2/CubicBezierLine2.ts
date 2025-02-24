import {CubicBezierCurve3} from "three";

import {IGetCubicBezierCurve3PointsOptions, LineTool} from "../../../tool/LineTool";
import {ILine2Options, Line2} from "./Line2";

export interface ICubicBezierLine2Options extends ILine2Options, Omit<IGetCubicBezierCurve3PointsOptions, "cubicBezierCurve3"> {

}

export class CubicBezierLineLine extends Line2 {
    cubicBezierCurve3: CubicBezierCurve3 = new CubicBezierCurve3()
    declare options: Required<ICubicBezierLine2Options>;

    constructor(_options: ICubicBezierLine2Options) {
        super({
            ..._options,
            isDelayInit: true
        });
        this.update(this.options);
    }

    getLinePoints() {
        const cubicBezierCurve3 = LineTool.getCubicBezierCurve3Points({
            cubicBezierCurve3: this.cubicBezierCurve3,
            ...this.options
        });
        return cubicBezierCurve3.getPoints(this.options.segments)
    }
}