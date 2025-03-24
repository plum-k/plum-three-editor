import {Component, IComponentOptions} from "../../core/Component";
import {IPickInfo} from "../../manager";

export interface IMeasureOptions extends IComponentOptions {

}


export class Measure<T extends IMeasureOptions = IMeasureOptions> extends Component<T> {
    constructor(options: T) {
        super(options);
    }

    onAddPointEvent(value: IPickInfo) {
    }

    onMoveEvent(value: IPickInfo) {

    }

    onEndEvent(value: IPickInfo) {

    }
}