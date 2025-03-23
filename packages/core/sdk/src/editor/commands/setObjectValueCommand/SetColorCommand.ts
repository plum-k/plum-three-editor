import * as THREE from 'three';
import {invoke, isArray, PropertyPath} from "lodash-es";
import {SetValueCommand} from "../SetValueCommand";
import {Color, Object3D} from "three";
const color = new Color();

export class SetColorCommand extends SetValueCommand {
    type = 'SetColorCommand';

    constructor(object: Object3D, attributeName: PropertyPath, newValue: any, oldValue: any) {
        super(object, attributeName, newValue, oldValue);
        this.attributeName = attributeName;
        this.name = 'command/SetColorCommand' + ': ' + this.getAttributeName();
        this.object = object;
        this.newValue = newValue;
        this.newValue = color.setStyle(newValue).getHex();
        if (oldValue) {
            this.oldValue = oldValue;
        } else {
            this.oldValue = invoke(object, [attributeName, "getHex"]);
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
            invoke(this.object, [this.attributeName, "setHex"], value);
        }
    }
    update(cmd: SetColorCommand) {
        this.newValue = cmd.newValue;
    }
    execute() {
        this.setValue(true);
    }

    undo() {
        this.setValue(false);
    }
}
