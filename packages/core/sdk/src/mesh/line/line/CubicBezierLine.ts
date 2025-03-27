import {CubicBezierCurve3} from "three";
import {ILineOptions, PLine} from "./PLine";
import {IGetCubicBezierCurve3PointsOptions, LineTool} from "../../../tool/LineTool";

export interface ICubicBezierLineOptions extends ILineOptions, Omit<IGetCubicBezierCurve3PointsOptions, "cubicBezierCurve3"> {

}

export class CubicBezierLine extends PLine {
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