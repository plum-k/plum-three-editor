import {CatmullRomCurve3} from "three";
import {ILineOptions, Line} from "./Line";

export enum CurveType {
    Centripetal = 'centripetal',
    Chordal = 'chordal',
    CatmullRom = 'catmullrom'
}

export interface ICatmullRomLineOptions extends ILineOptions {
    closed?: boolean
    curveType?: CurveType
    tension?: number
    segments?: number
}

export const CatmullRomLineDefaultsOptions: ICatmullRomLineOptions = {
    closed: false,
    curveType: CurveType.CatmullRom,
    tension: 0.5,
    segments: 20
}

export class CatmullRomLine extends Line {
    catmullRomCurve3: CatmullRomCurve3 = new CatmullRomCurve3();
    declare options: Required<ICatmullRomLineOptions>;

    constructor(_options: ICatmullRomLineOptions) {
        super({
            ...CatmullRomLineDefaultsOptions,
            ..._options,
            isDelayInit: true
        });
        this.update(this.options)
    }

    update(_options: ICatmullRomLineOptions) {
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


