import {Module, IModuleOptions } from "../../core/Module";
import {IPick} from "../../manager";

export interface IMeasureOptions extends IModuleOptions  {

}


export class Measure<T extends IMeasureOptions = IMeasureOptions> extends Module<T> {
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