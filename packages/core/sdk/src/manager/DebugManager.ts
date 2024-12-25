import Stats from "stats.js";

import BasePlum, {IBasePlumOptions} from "../core/BasePlum";
import {deepMergeRetain} from "@plum-render/tool";

export interface IDebugOptions extends IBasePlumOptions {
    showMs?: boolean;
    showMb?: boolean;
    showFps?: boolean
}

export enum DebugPosition {
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight,
}

export default class DebugManager extends BasePlum<IDebugOptions> {
    stats: Stats;

    constructor(options: IDebugOptions) {
        super(options);
        this.options = deepMergeRetain(options, {
            showFps: true,
            showMs: true,
            showMb: true,
        },);

        this.stats = new Stats();
        this.setStats();

        this.stats.dom.style.position = 'absolute'

        this.addToDOM();
        this.setPosition(DebugPosition.BottomLeft)
        this.eventManager.renderSubject.subscribe(() => {
            this.update();
        })
    }

    setStats() {
        if (this.options.showFps) {
            // @ts-ignore
            this.stats.dom.children[0].style.display = 'block';
        } else {
            // @ts-ignore
            this.stats.dom.children[0].style.display = 'none';
        }
        if (this.options.showMs) {
            // @ts-ignore
            this.stats.dom.children[1].style.display = 'block';
        } else {
            // @ts-ignore
            this.stats.dom.children[1].style.display = 'none';
        }
        if (this.options.showMb) {
            // @ts-ignore
            this.stats.dom.children[2].style.display = 'block';
        } else {
            // @ts-ignore
            this.stats.dom.children[2].style.display = 'none';
        }
    }

    setPosition(value: DebugPosition) {
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

    addToDOM() {
        const container = this.viewer.container;
        container.appendChild(this.stats.dom);
    }

    update() {
        this.stats.update();
    }

    dispose() {
        const container = this.viewer.container;
        container.removeChild(this.stats.dom);
    }
}