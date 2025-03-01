import {CatmullRomCurve3} from "three";
import {ILine2Options, Line2} from "./Line2";
import {CurveType} from "../line";

export interface ICatmullRomLine2Options extends ILine2Options {
    closed?: boolean
    curveType?: 'centripetal' | 'chordal' | 'catmullrom'
    tension?: number
    segments?: number
}

export const CatmullRomLine2DefaultsOptions: ICatmullRomLine2Options = {
    closed: false,
    curveType: CurveType.CatmullRom,
    tension: 0.5,
    segments: 20
}

export class CatmullRomLine2 extends Line2 {
    catmullRomCurve3: CatmullRomCurve3 = new CatmullRomCurve3();
    declare options: Required<ICatmullRomLine2Options>;

    constructor(_options: ICatmullRomLine2Options) {
        super({
            ...CatmullRomLine2DefaultsOptions,
            ..._options,
            isDelayInit: true
        });
        this.update(this.options)
    }

    update(_options: ICatmullRomLine2Options) {
        super.update(_options);
    }

    getLinePoints() {
        const {points, closed, curveType, tension, segments} = this.options
        this.catmullRomCurve3.points = this.points;
        this.catmullRomCurve3.closed = closed;
        this.catmullRomCurve3.curveType = curveType;
        this.catmullRomCurve3.tension = tension;


        return this.catmullRomCurve3.getPoints(this.options.segments)
    }
}


