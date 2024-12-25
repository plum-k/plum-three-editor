import {CubicBezierCurve3} from "three";
import Line, {ILineOptions} from "./Line";
import LineTool, {IGetCubicBezierCurve3PointsOptions} from "../../../tool/LineTool";

export interface ICubicBezierLineOptions extends ILineOptions, Omit<IGetCubicBezierCurve3PointsOptions, "cubicBezierCurve3"> {

}

export default class CubicBezierLine extends Line {
    cubicBezierCurve3: CubicBezierCurve3 = new CubicBezierCurve3()
    declare options: Required<ICubicBezierLineOptions>;

    constructor(_options: ICubicBezierLineOptions) {
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