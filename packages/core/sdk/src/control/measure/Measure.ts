import {BasePlum, IBasePlumOptions} from "../../core/BasePlum";
import {IPick} from "../../manager";

export interface IMeasureOptions extends IBasePlumOptions {

}


export class Measure<T extends IMeasureOptions = IMeasureOptions> extends BasePlum<T> {
    constructor(options: T) {
        super(options);
    }

    onAddPointEvent(value: IPick) {
    }

    onMoveEvent(value: IPick) {

    }

    onEndEvent(value: IPick) {

    }
}