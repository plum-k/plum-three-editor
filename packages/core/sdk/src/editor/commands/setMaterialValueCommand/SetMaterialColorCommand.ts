import {Command} from "../Command";
import * as THREE from 'three';
import {Tool} from "../../../tool";
import {invoke, isArray, PropertyPath} from "lodash-es";
import {Color, Object3D} from "three";
const color = new Color();
export class SetMaterialColorCommand extends Command<number> {
    type: string = 'SetMaterialColorCommand';
    materialSlot: number;

    constructor(object: Object3D, attributeName: PropertyPath, newValue: string, materialSlot: number = -1) {
        super();
        this.updatable = true;
        this.name = 'command/SetMaterialColor' + ': ' + attributeName;

        this.object = object;
        this.materialSlot = materialSlot;

        const material = Tool.getObjectMaterial(object as Mesh, materialSlot)
        this.newValue = color.setStyle(newValue).getHex();
        this.attributeName = attributeName;

        this.oldValue = invoke(material, [attributeName, "getHex"]);
    }

    /**
     * 设置对象的属性值
     * @param isExecute 是否执行命令，true为执行，false为撤销
     */
    setValue(isExecute: boolean) {
        const material = Tool.getObjectMaterial(this.object as Mesh, this.materialSlot);
        const value = isExecute ? this.newValue : this.oldValue;
            invoke(material, [this.attributeName, "setHex"], value);
        // this.editor.signals.materialChanged.dispatch(this.object, this.materialSlot);
    }

    execute() {
        this.setValue(true);
    }

    undo() {
        this.setValue(false);
    }

    update(cmd: SetMaterialColorCommand) {
        this.newValue = cmd.newValue;
    }

    toJSON() {
        const output = super.toJSON();

        output.objectUuid = this.object!.uuid;
        output.attributeName = this.attributeName;
        output.oldValue = this.oldValue;
        output.newValue = this.newValue;
        output.materialSlot = this.materialSlot;

        return output;
    }

    fromJSON(json: any) {
        super.fromJSON(json);

        this.object = this.editor.objectByUuid(json.objectUuid)!;
        this.attributeName = json.attributeName;
        this.oldValue = json.oldValue;
        this.newValue = json.newValue;
        this.materialSlot = json.materialSlot;
    }
}