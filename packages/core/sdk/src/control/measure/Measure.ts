import {Component, IComponentOptions} from "../../core/Component";
import {IPick} from "../../manager";

export interface IMeasureOptions extends IComponentOptions {

}


export class Measure<T extends IMeasureOptions = IMeasureOptions> extends Component<T> {
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