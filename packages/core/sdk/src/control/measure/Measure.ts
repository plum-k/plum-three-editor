import BasePlum, {IBasePlumOptions} from "../../core/BasePlum";
import {IPick} from "../../manager/EventManager";

export interface IMeasureOptions extends IBasePlumOptions {

}


export default class Measure<T extends IMeasureOptions = IMeasureOptions> extends BasePlum<T> {
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