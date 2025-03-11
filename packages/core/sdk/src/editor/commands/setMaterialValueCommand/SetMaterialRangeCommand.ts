import {Command} from "../Command";
import * as THREE from 'three';


export class SetMaterialRangeCommand extends Command<Array<number>> {
    type: string = 'SetMaterialRangeCommand';
    materialSlot: number;
    attributeName: string;

    constructor(
        object: THREE.Object3D,
        attributeName: string = '',
        newMinValue: number = -Infinity,
        newMaxValue: number = Infinity,
        materialSlot: number = -1
    ) {
        super();

        this.name = 'command/SetMaterialRange' + ': ' + attributeName;
        this.updatable = true;

        this.object = object;
        this.materialSlot = materialSlot;

        const material = (object !== null) ? Tool.getObjectMaterial(object, materialSlot) : null;

        this.oldValue = (material !== null && material[attributeName] !== undefined) ? [...material[attributeName]] : null;
        this.newValue = [newMinValue, newMaxValue];

        this.attributeName = attributeName;
    }

    execute() {
        const material = Tool.getObjectMaterial(this.object!, this.materialSlot);

        material[this.attributeName] = [...this.newValue];
        material.needsUpdate = true;

        // this.editor.signals.objectChanged.dispatch(this.object!);
        this.editor.signals.materialChanged.dispatch(this.object!, this.materialSlot);
    }

    undo() {
        const material = Tool.getObjectMaterial(this.object!, this.materialSlot);

        material[this.attributeName] = [...this.oldValue!];
        material.needsUpdate = true;

        // this.editor.signals.objectChanged.dispatch(this.object!);
        this.editor.signals.materialChanged.dispatch(this.object!, this.materialSlot);
    }

    update(cmd: SetMaterialRangeCommand) {
        this.newValue = [...cmd.newValue];
    }

    toJSON() {
        const output = super.toJSON();

        output.objectUuid = this.object!.uuid;
        output.attributeName = this.attributeName;
        output.oldValue = [...this.oldValue!];
        output.newValue = [...this.newValue];
        output.materialSlot = this.materialSlot;

        return output;
    }

    fromJSON(json: any) {
        super.fromJSON(json);

        this.attributeName = json.attributeName;
        this.oldValue = [...json.oldValue];
        this.newValue = [...json.newValue];
        this.object = this.editor.objectByUuid(json.objectUuid)!;
        this.materialSlot = json.materialSlot;
    }
}