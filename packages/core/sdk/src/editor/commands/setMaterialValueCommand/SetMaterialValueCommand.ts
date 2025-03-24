import {Command} from "../Command";

import {get, isArray, PropertyPath, set} from "lodash-es";
import {Tool} from "../../../tool";
import json from "@rollup/plugin-json";

export class SetMaterialValueCommand extends Command {
    type: string = 'SetMaterialValueCommand';
    materialSlot: number;
    attributeName: string;

    constructor(object: Object3D, attributeName: PropertyPath, newValue: any, materialSlot = -1) {
        super();
        this.updatable = true;
        this.name = 'command/SetMaterialValue' + ': ' + attributeName;

        this.object = object;
        this.materialSlot = materialSlot;

        const material = Tool.getObjectMaterial(object as Mesh, materialSlot)

        this.oldValue = get(material, attributeName);
        this.newValue = newValue;

        this.attributeName = attributeName;
    }
    /**
     * 设置对象的属性值
     * @param isExecute 是否执行命令，true为执行，false为撤销
     */
    setValue(isExecute: boolean) {
        const material = Tool.getObjectMaterial(this.object as Mesh, this.materialSlot);
        const value = isExecute ? this.newValue : this.oldValue;
        set(material, this.attributeName, value);
        material.needsUpdate = true;
        // this.editor.signals.objectChanged.dispatch(this.object!);
        // this.editor.signals.materialChanged.dispatch(this.object!, this.materialSlot);
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

    fromJSON(json: any) {

        super.fromJSON(json);

        this.attributeName = json.attributeName;
        this.oldValue = json.oldValue;
        this.newValue = json.newValue;
        this.object = this.editor.objectByUuid(json.objectUuid);
        this.materialSlot = json.materialSlot;

    }

    update(command: this): void {
    }
}