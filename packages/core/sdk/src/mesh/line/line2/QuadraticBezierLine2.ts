import {QuadraticBezierCurve3} from "three";

import {IGetQuadraticBezierCurve3PointsOptions, LineTool} from "../../../tool/LineTool";
import {ILine2Options, Line2} from "./Line2";

export interface IQuadraticBezierLine2Options extends ILine2Options, Omit<IGetQuadraticBezierCurve3PointsOptions, "quadraticBezierCurve3"> {
}


export class QuadraticBezierLine2 extends Line2 {
    quadraticBezierCurve3: QuadraticBezierCurve3;
    declare options: Required<IQuadraticBezierLine2Options>;

    constructor(_options: IQuadraticBezierLine2Options) {
        super({
            ..._options,
            isDelayInit: true,
        });
        this.quadraticBezierCurve3 = new QuadraticBezierCurve3()
        this.update(this.options)
    }

    init() {
    }


    update(_options: IQuadraticBezierLine2Options) {
        super.update(_options);
    }

    getLinePoints() {
        const quadraticBezierCurve3 = LineTool.getQuadraticBezierCurve3Points({
            ...this.options,
            quadraticBezierCurve3: this.quadraticBezierCurve3,
        })
        console.log(quadraticBezierCurve3.getPoints(this.options.segments))
        return quadraticBezierCurve3.getPoints(this.options.segments)
    }
}