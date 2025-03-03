import {fromEvent, Subject} from 'rxjs';
import {Component, IComponentOptions} from "../core/Component";
import * as THREE from 'three';
import {Tool} from "../tool/Tool";

export interface IEventManagerOptions extends IComponentOptions {
}

export interface IPick {
    intersects: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[];
    position: THREE.Vector3
}

export class EventManager extends Component {


    dblClickSubject = new Subject<MouseEvent>();
    resizeSubject = new Subject<UIEvent>();
    // 每次渲染更新时候触发
    renderSubject = new Subject<number>();

    // 对外暴露的点击事件
    clickSubject = new Subject<THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[]>();

    // div 原生的点击事件
    domClickSubject = new Subject<MouseEvent>();

    dragoverSubject = new Subject<DragEvent>();
    dropSubject = new Subject<DragEvent>();

    // 记录 点击事件的位置
    onLeftDownPosition = new THREE.Vector2();
    onLeftUpPosition = new THREE.Vector2();

    onRightDownPosition = new THREE.Vector2();
    onRightUpPosition = new THREE.Vector2();

    // 排除拖动的点击事件
    leftClickSubject = new Subject<MouseEvent>();
    rightClickSubject = new Subject<MouseEvent>();
    pointerMoveSubject = new Subject<MouseEvent>();
    // 射线检测后点击事件
    leftClickPickSubject = new Subject<IPick>();
    rightClickPickSubject = new Subject<IPick>();
    dblClickPickSubject = new Subject<IPick>();
    // 鼠标移动事件, 经过射线检测
    pointerMovePickSubject = new Subject<IPick>();


    constructor(options: IEventManagerOptions) {
        super(options);
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // const mousedown = fromEvent<MouseEvent>(this.container, 'mousedown');
        // mousedown.subscribe((event) => {
        //     
        // })
        // const mouseup = fromEvent<MouseEvent>(this.container, 'mouseup');
        // mouseup.subscribe((event) => {
        //     
        // })

        const click = fromEvent<MouseEvent>(this.container, 'click');
        const dblClick = fromEvent<MouseEvent>(this.container, 'dblclick');
        const rightClick = fromEvent<MouseEvent>(this.container, 'contextmenu');
        const resize = fromEvent<UIEvent>(window, 'resize');

        const dragover = fromEvent<DragEvent>(this.container, 'dragover');
        const drop = fromEvent<DragEvent>(this.container, 'drop');

        //鼠标移动事件
        const pointermove = fromEvent<DragEvent>(this.container, 'pointermove');
        pointermove.subscribe((event) => {
            this.pointerMoveSubject.next(event);
        })

        //鼠标按下事件
        const pointerdown = fromEvent<DragEvent>(this.container, 'pointerdown');
        pointerdown.subscribe((event) => {
            const array = Tool.getMousePosition(event, this.container);
            if (event.button === 0) {
                this.onLeftDownPosition.fromArray(array);
                // 
            } else if (event.button === 2) {
                this.onRightDownPosition.fromArray(array);
                // 
            }
            // 
        })

        //鼠标抬起事件
        const pointerup = fromEvent<DragEvent>(this.container, 'pointerup');
        pointerup.subscribe((event) => {
            const array = Tool.getMousePosition(event, this.container);
            if (event.button === 0) {
                this.onLeftUpPosition.fromArray(array);
                if (this.onLeftDownPosition.distanceTo(this.onLeftUpPosition) === 0) {
                    this.leftClickSubject.next(event);
                }
                // 
            } else if (event.button === 2) {
                this.onRightUpPosition.fromArray(array);
                if (this.onRightDownPosition.distanceTo(this.onRightUpPosition) === 0) {
                    this.rightClickSubject.next(event);
                }
                // 
            }

            // 
        })

        // 左键双击
        dblClick.subscribe(event => {
            this.dblClickSubject.next(event);
        });

        // const pointerenter = fromEvent<DragEvent>(this.container, 'pointerenter');
        // pointerenter.subscribe((event) => {
        //     
        // })
        dragover.subscribe((event) => {
            event.preventDefault(); // Prevent default behavior
            event.dataTransfer!.dropEffect = 'copy'; // Indicate that files can be copied
            this.dragoverSubject.next(event)
        })

        drop.subscribe((event) => {
            {
                event.preventDefault();
                this.dropSubject.next(event)
            }
        })

        // Single Click
        click
            // .pipe(
            //     buffer(click$.pipe(debounceTime(300))),
            //     filter(clickArray => clickArray.length === 1)
            // )
            .subscribe(event => {
                // 
                this.domClickSubject.next(event);
            });


        // Right Click
        rightClick.subscribe(event => {
            event.preventDefault(); // Prevent default context menu
            this.rightClickSubject.next(event);
        });

        // Resize
        resize.subscribe(event => {
            this.resizeSubject.next(event);
        });
    }
}
