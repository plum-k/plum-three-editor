import {BasePlum, IBasePlumOptions} from "../core/BasePlum";
import * as THREE from "three";
import {isNil} from "lodash-es";
import {IPick} from "../manager/EventManager";
import {Subscription} from "rxjs";

export interface IDrawLine extends IBasePlumOptions {
}

export enum DrawType {
    Line,
    Point
}

export class DrawLine<T extends abstract new (...args: any) => any> extends BasePlum {

    pointGroup = new THREE.Group();
    points: Array<THREE.Vector3> = [];
    line!: InstanceType<T>;

    drawType = DrawType.Line

    DrawLineType!: T
    DrawLineParams!: ConstructorParameters<T>[0]

    DrawControlPointType: typeof THREE.BoxGeometry | undefined = THREE.BoxGeometry;
    onAddPointSubscription: Subscription | undefined
    onStopSubscription: Subscription | undefined

    constructor(options: IDrawLine) {
        super(options);

        this.scene.add(this.pointGroup)

        this.eventManager.leftClickPickSubject.subscribe((value) => {

        })
        // this.eventManager.rightClickPickSubject.subscribe((value) => {
        //     console.log("11")
        //     console.log(value)
        // })
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
        //     console.log("11")
        //     console.log(value)
        // })

    }

    onStopEvent(value: IPick) {
        this.stop();
    }

    onAddPoint(value: IPick) {
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

    drawPoint(value: IPick) {

    }

    drawControlPoint(value: IPick) {
        const {position, intersects} = value;
        if (this.DrawControlPointType) {
            const boxGeometry = new this.DrawControlPointType(1, 1, 1);
            const boxMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
            const box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.copy(position);
            this.pointGroup.add(box)
        }
    }

    drawLine(value: IPick) {
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