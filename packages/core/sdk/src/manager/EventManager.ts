import {fromEvent, Subject} from 'rxjs';
import {Component, IComponentOptions} from "../core/Component";
import {Intersection, Object3D, Object3DEventMap, Vector2, Vector3} from 'three';
import {Tool} from "../tool/Tool";
import {IPickInfo} from "../interface/pick/IPickInfo";
import {IRenderSubjectValue} from "../interface/EventManager/IRenderSubjectValue";

export interface IEventManagerOptions extends IComponentOptions {
}


export class EventManager extends Component {

    dblClickSubject = new Subject<MouseEvent>();
    // 容器重置
    resizeSubject = new Subject<boolean>();
    // 每次渲染更新时候触发
    renderSubject = new Subject<IRenderSubjectValue>();

    // 对外暴露的点击事件
    clickSubject = new Subject<Intersection<Object3D<Object3DEventMap>>[]>();

    // div 原生的点击事件
    domClickSubject = new Subject<MouseEvent>();

    dragoverSubject = new Subject<DragEvent>();
    dropSubject = new Subject<DragEvent>();

    // 记录 点击事件的位置
    onLeftDownPosition = new Vector2();
    onLeftUpPosition = new Vector2();

    onRightDownPosition = new Vector2();
    onRightUpPosition = new Vector2();

    // 排除拖动的点击事件
    leftClickSubject = new Subject<MouseEvent>();
    rightClickSubject = new Subject<MouseEvent>();
    pointerMoveSubject = new Subject<MouseEvent>();
    // 射线检测后点击事件
    leftClickPickSubject = new Subject<IPickInfo>();
    rightClickPickSubject = new Subject<IPickInfo>();
    dblClickPickSubject = new Subject<IPickInfo>();
    // 鼠标移动事件, 经过射线检测
    pointerMovePickSubject = new Subject<IPickInfo>();


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
            this.resizeSubject.next(true);
        });
    }
}
