import BasePlum, {IBasePlumOptions} from "../core/BasePlum";
import {Subject} from "rxjs";

export type GlobalRenderCallback = (timeStamp: number) => void
type SubItem = { callback: GlobalRenderCallback }
export type GlobalEffectType = 'before' | 'after' | 'tail'

export interface ILoop extends IBasePlumOptions {

}

export default class Loop extends BasePlum {

    globalEffects: Set<Function> = new Set()
    globalAfterEffects: Set<Function> = new Set()
    globalTailEffects: Set<Function> = new Set()
    running = false
    useFrameInProgress = false
    repeat: number = 0
    frame: number = 0
    startTime = 0;
    endTime = 0;
    renderTime = 0;
    // 每次渲染完成后触发
    sceneRendered = new Subject<any>();

    constructor(options: ILoop) {
        super(options);
        // this.loop(1);
    }

    flushGlobalEffects(type: GlobalEffectType, timestamp: number) {
        switch (type) {
            case 'before':
                this.run(this.globalEffects, timestamp)
                break
            case 'after':
                this.run(this.globalAfterEffects, timestamp)
                break
            case 'tail':
                this.run(this.globalTailEffects, timestamp)
                break
        }
    }

    addEffect = (callback: Function) => {
        this.globalEffects.add(callback);
    }

    addAfterEffect = (callback: Function) => {
        this.globalAfterEffects.add(callback);
    }

    addTail = (callback: Function) => {
        this.globalTailEffects.add(callback);
    }

    run(effects: Set<Function>, timestamp: number) {
        if (!effects.size) return
        for (const callback of effects.values()) {
            callback({
                viewer: this.viewer
            })
        }
    }

    frameLoop = (timestamp: number) => {
        try {
            this.frame = requestAnimationFrame(this.frameLoop);

            this.startTime = performance.now();

            this.running = true
            this.repeat = 0
            this.flushGlobalEffects('before', timestamp)

            // todo 多屏幕渲染
            this.renderManager.render()
            this.cssRenderer.render();

            this.eventManager.renderSubject.next(timestamp)

            this.flushGlobalEffects('after', timestamp)
            this.endTime = performance.now();

            this.renderTime = this.endTime - this.startTime;

            this.sceneRendered.next(this.renderTime)
        } catch (e) {
            console.log(e)
        }

    }

    startLoop = () => {
        this.running = true
        this.frame = requestAnimationFrame(this.frameLoop);
    }

    stopLoop = () => {
        this.running = false
        return cancelAnimationFrame(this.frame)
    }

}