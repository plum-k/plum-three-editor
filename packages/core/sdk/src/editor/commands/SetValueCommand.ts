import {Command} from "./Command";
import * as THREE from 'three';
import {get, isArray, isNil, PropertyPath, set} from "lodash-es";

/**
 * SetValueCommand类用于在三维场景中更改对象的属性值
 * 它继承自Command类，并实现了一些用于执行、撤销和序列化命令的方法
 */
export class SetValueCommand extends Command<any> {
    type = 'SetValueCommand';

    /**
     * 构造函数
     * @param object 要修改的三维对象
     * @param attributeName 属性路径，可以是字符串或字符串数组，指向具体的属性
     * @param newValue 新的属性值
     * @param oldValue 旧的属性值，如果未提供，则从对象中获取
     */
    constructor(object: THREE.Object3D, attributeName: PropertyPath, newValue: any, oldValue: any) {
        super();
        this.attributeName = attributeName;

        this.name = 'command/SetValue' + ': ' + this.getAttributeName();
        this.object = object;
        this.newValue = newValue;
        if (oldValue) {
            this.oldValue = oldValue;
        } else {
            this.oldValue = isNil(object) ? null : get(object, attributeName);
        }
    }

    /**
     * 设置对象的属性值
     * @param isExecute 是否执行命令，true为执行，false为撤销
     */
    setValue(isExecute: boolean) {
        // 根据isExecute的值决定使用newValue还是oldValue
        const value = isExecute ? this.newValue : this.oldValue;
        if (isArray(this.attributeName) && this.attributeName.length > 0) {
            set(this.object, this.attributeName, value);
            if (["position", "rotation", "scale"].includes(this.attributeName[0])) {
                this.editor.editorEventManager.objectChanged.next(this.object)
            }
        }else {
            // 当属性为显示隐藏时，触发场景图更新
            set(this.object, this.attributeName, value);
            if (this.attributeName === "visible") {
                this.editor.editorEventManager.sceneGraphChanged.next(null);
            }
        }
    }

    /**
     * 执行命令
     */
    execute() {
        this.setValue(true);
    }

    /**
     * 撤销命令
     */
    undo() {
        this.setValue(false);
    }

    /**
     * 更新命令，主要用于在命令被修改时更新其内部值
     * @param cmd 更新用的新命令对象
     */
    update(cmd: SetValueCommand) {
        this.newValue = cmd.newValue;
    }

    /**
     * 将命令对象转换为JSON格式
     * @returns JSON格式的对象
     */
    toJSON() {
        const output = super.toJSON();
        output.objectUuid = this.object!.uuid;
        output.attributeName = this.attributeName;
        output.oldValue = this.oldValue;
        output.newValue = this.newValue;

        return output;
    }

    /**
     * 从JSON对象反序列化命令
     * @param json JSON格式的对象
     */
    fromJSON(json: any) {
        super.fromJSON(json);
        this.attributeName = json.attributeName;
        this.oldValue = json.oldValue;
        this.newValue = json.newValue;
        this.object = this.editor.objectByUuid(json.objectUuid)!!;
    }
}
