import Stats from "stats.js";
import {IModuleOptions, Module} from "../core/Module";
import {deepMergeRetain} from "../tool";
import {Subscription} from "rxjs";

export interface IDebugOptions extends IModuleOptions {
    showMs?: boolean;
    showMb?: boolean;
    showFps?: boolean;
    position?: DebugPosition;
}

export enum DebugPosition {
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight,
}

export class DebugManager extends Module<IDebugOptions> {
    stats: Stats | undefined
    subscription: Subscription | undefined
    #enable = false

    constructor(options: IDebugOptions) {
        super(options);
        this.options = deepMergeRetain(options, {
            showFps: true,
            showMs: true,
            showMb: true,
            position: DebugPosition.BottomLeft,
        },);
    }

    get enable() {
        return this.#enable
    }

    set enable(value: boolean) {
        if (value) {
            if (!this.stats) {
                this.stats = new Stats();
                this.setStats();
                this.stats.dom.style.position = 'absolute'
                this.setPosition(this.options.position);
                this.addToDom();
            }
            if (!this.subscription) {
                this.subscription = this.eventManager.renderSubject.subscribe(() => {
                    this.update();
                })
            }
        } else {
            if (this.subscription) {
                this.subscription.unsubscribe();
                this.subscription = undefined;
            }
            if (this.stats) {
                this.dispose();
            }
        }
        this.#enable = value;
    }

    setStats() {
        if (!this.stats) return;
        const getElement = (index: number): HTMLElement => {
            return this.stats!.dom.children[index] as HTMLElement;
        }
        if (this.options.showFps) {
            getElement(0).style.display = 'block';
        } else {
            getElement(0).style.display = 'none';
        }
        if (this.options.showMs) {
            getElement(1).style.display = 'block';
        } else {
            getElement(1).style.display = 'none';
        }
        if (this.options.showMb) {
            getElement(2).style.display = 'block';
        } else {
            getElement(2).style.display = 'none';
        }
    }

    setPosition(value: DebugPosition) {
        if (!this.stats) return;
        this.stats.dom.style.left = '';
        this.stats.dom.style.top = '';
        this.stats.dom.style.right = '';
        this.stats.dom.style.bottom = '';
        switch (value) {
            case DebugPosition.TopLeft:
                this.stats.dom.style.left = '0px';
                this.stats.dom.style.top = '0px';
                break;
            case DebugPosition.TopRight:
                this.stats.dom.style.right = '0px';
                this.stats.dom.style.top = '0px';
                break;
            case DebugPosition.BottomLeft:
                this.stats.dom.style.left = '0px';
                this.stats.dom.style.bottom = '0px';
                break;
            case DebugPosition.BottomRight:
                this.stats.dom.style.right = '0px';
                this.stats.dom.style.bottom = '0px';
                break;
        }
    }


    addToDom() {
        if (!this.stats) return;
        const container = this.viewer.container;
        container.appendChild(this.stats.dom);
    }

    update() {
        if (!this.stats) return;
        this.stats.update();
    }

    dispose() {
        if (!this.stats) return;
        const container = this.viewer.container;
        container.removeChild(this.stats.dom);
        this.stats = undefined;
    }
}