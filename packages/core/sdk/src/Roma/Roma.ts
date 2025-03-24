import {CatmullRomCurve3, Vector3} from "three";

export class Roma {

    constructor() {


    }

    initLine(points?: Vector3[]) {
        const pathCurve = new CatmullRomCurve3(points, false, 'catmullrom', 0);


    }


}