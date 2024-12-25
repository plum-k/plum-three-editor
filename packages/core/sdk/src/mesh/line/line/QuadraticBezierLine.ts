import {QuadraticBezierCurve3} from "three";
import Line, {ILineOptions} from "./Line";
import LineTool, {IGetQuadraticBezierCurve3PointsOptions} from "../../../tool/LineTool";

export interface IQuadraticBezierLineOptions extends ILineOptions, Omit<IGetQuadraticBezierCurve3PointsOptions, "quadraticBezierCurve3"> {
}


export default class QuadraticBezierLine extends Line {
    quadraticBezierCurve3: QuadraticBezierCurve3 = new QuadraticBezierCurve3()
    declare options: Required<IQuadraticBezierLineOptions>;

    constructor(_options: IQuadraticBezierLineOptions) {
        super({
            ..._options,
            isDelayInit: true
        });
        // this.init();
        this.update(this.options);
    }

    init() {
    }


    update(_options: IQuadraticBezierLineOptions) {
        super.update(_options);
    }

    getLinePoints() {
        const quadraticBezierCurve3 = LineTool.getQuadraticBezierCurve3Points({
            ...this.options,
            quadraticBezierCurve3: this.quadraticBezierCurve3,
        })
        return quadraticBezierCurve3.getPoints(this.options.segments || 20)
    }
}