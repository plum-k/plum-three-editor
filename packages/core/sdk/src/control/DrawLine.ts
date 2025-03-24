import {Component, IComponentOptions} from "../core/Component";

import {isNil} from "lodash-es";
import {IPickInfo} from "../manager/EventManager";
import {Subscription} from "rxjs";
import {BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3} from "three";

export interface IDrawLine extends IComponentOptions {
}

export enum DrawType {
    Line,
    Point
}

export class DrawLine<T extends abstract new (...args: any) => any> extends Component {

    pointGroup = new Group();
    points: Array<Vector3> = [];
    line!: InstanceType<T>;

    drawType = DrawType.Line

    DrawLineType!: T
    DrawLineParams!: ConstructorParameters<T>[0]

    DrawControlPointType: typeof BoxGeometry | undefined = BoxGeometry;
    onAddPointSubscription: Subscription | undefined
    onStopSubscription: Subscription | undefined

    constructor(options: IDrawLine) {
        super(options);


        this.eventManager.leftClickPickSubject.subscribe((value) => {

        })
        // this.eventManager.rightClickPickSubject.subscribe((value) => {
        //     
        //     
        // })
    }

    init() {
        this.scene.add(this.pointGroup)
    }

    start() {
        this.initEvent();
    }

    stop() {
        this.onAddPointSubscription?.unsubscribe();
        this.onStopSubscription?.unsubscribe();
    }

    initEvent() {
        this.onAddPointSubscription = this.eventManager.leftClickPickSubject.subscribe((value) => {
            this.onAddPoint(value);
        })
        this.onStopSubscription = this.eventManager.dblClickPickSubject.subscribe((value) => {
            this.onStopEvent(value);
        })
        // this.eventManager.rightClickPickSubject.subscribe((value) => {
        //     
        //     
        // })
    }

    onStopEvent(value: IPickInfo) {
        this.stop();
    }

    onAddPoint(value: IPickInfo) {
        const {position, intersects} = value;
        this.points.push(position)
        switch (this.drawType) {
            case DrawType.Point:
                this.drawPoint(value)
                break
            case DrawType.Line:
                this.drawControlPoint(value)
                this.drawLine(value)
                break

        }
    }

    drawPoint(value: IPickInfo) {

    }

    drawControlPoint(value: IPickInfo) {
        const {position, intersects} = value;
        if (this.DrawControlPointType) {
            const boxGeometry = new this.DrawControlPointType(1, 1, 1);
            const boxMaterial = new MeshBasicMaterial({color: 0xffffff});
            const box = new Mesh(boxGeometry, boxMaterial);
            box.position.copy(position);
            this.pointGroup.add(box)
        }
    }

    drawLine(value: IPickInfo) {
        if (this.points.length > 1) {
            if (isNil(this.line)) {
                if (this.DrawLineType) {
                    this.line = new this.DrawLineType(this.DrawLineParams);
                    this.scene.add(this.line);
                }
            } else {
                this.line.setPoints(this.points);
            }
        }
    }

    addLine() {

    }
}