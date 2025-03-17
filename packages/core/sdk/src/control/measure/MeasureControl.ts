import {Subscription} from "rxjs";
import { Measure} from "./Measure";
import {DistanceMeasure, EDistanceMeasureTextModel, IBaseDistanceMeasureOptions} from "./DistanceMeasure";
import {IComponentOptions,Component} from "../../core/Component";
export enum MeasureMode {
    Distance,    // 距离测量
    Area,            // 面积测量
    Angle           // 角度测量
}

export interface IMeasureToolOptions extends IComponentOptions {

}

export class MeasureTool extends Component {

    currentMeasure: Measure | undefined;
    leftClickSubscription: Subscription | null = null
    rightClickSubscription: Subscription | null = null
    pointerMoveSubscription: Subscription | null = null
    isAddEvent = false;
    dblClickSubscription: Subscription | null = null

    constructor(options: IMeasureToolOptions) {
        super(options);
    }

    addEvent() {
        if (this.isAddEvent) {
            return;
        }
        this.leftClickSubscription = this.eventManager.leftClickPickSubject.subscribe(value => {
            const {position} = value;
            this.currentMeasure?.onAddPointEvent(value);
        });

        this.rightClickSubscription = this.eventManager.rightClickPickSubject.subscribe(value => {
            const {position} = value;
            this.currentMeasure?.onAddPointEvent(value);
        });

        this.pointerMoveSubscription = this.eventManager.pointerMovePickSubject.subscribe(value => {
            const {position} = value;
            this.currentMeasure?.onMoveEvent(value);
        });

        this.dblClickSubscription = this.eventManager.dblClickPickSubject.subscribe(value => {
            const {position} = value;
            this.currentMeasure?.onEndEvent(value);
        });


        this.isAddEvent = true;
    }

    removeEvent() {
        this.leftClickSubscription?.unsubscribe();
        this.leftClickSubscription = null;

        this.rightClickSubscription?.unsubscribe();
        this.rightClickSubscription = null;

        this.pointerMoveSubscription?.unsubscribe();
        this.pointerMoveSubscription = null;
        this.isAddEvent = false;
    }

    startDistanceMeasure(options?: IBaseDistanceMeasureOptions) {
        this.currentMeasure = new DistanceMeasure({
            viewer: this.viewer,
            ...deepMergeRetain({
                    pointStopNum: 2,
                    textModel: EDistanceMeasureTextModel.Segment
                }, options
            )
        })
        this.addEvent();
    }

    start(model: MeasureMode) {
        switch (model) {
            case MeasureMode.Distance:
                break;
            case MeasureMode.Area:
                break;
            case MeasureMode.Angle:
                break;
        }
        this.addEvent();
    }

    end() {
        this.removeEvent();
    }

}
