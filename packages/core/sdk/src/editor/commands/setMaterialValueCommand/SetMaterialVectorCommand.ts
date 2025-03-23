import {Command} from "../Command";

import {Tool} from "../../../tool";

export class SetMaterialVectorCommand extends Command<Vector3> {
    type: string = 'SetMaterialVectorCommand';
    object: any;
    materialSlot: number;
    oldValue: number[] | null;
    newValue: number[] | null;
    attributeName: string;

    constructor(
        object: Object3D,
        attributeName: string,
        newValue: number[] | null = null,
        materialSlot: number = -1
    ) {
        super();

        this.name = 'command/SetMaterialVector' + ': ' + attributeName;
        this.updatable = true;
        this.object = object;
        this.materialSlot = materialSlot;

        const material = (object !== null) ? Tool.getObjectMaterial(object, materialSlot) : null;

        this.oldValue = (material !== null) ? material[attributeName].toArray() : null;
        this.newValue = newValue;

        this.attributeName = attributeName;
    }

    execute() {
        const material = Tool.getObjectMaterial(this.object, this.materialSlot);

        material[this.attributeName].fromArray(this.newValue!);

        // this.editor.signals.materialChanged.dispatch(this.object, this.materialSlot);
    }

    undo() {
        const material = Tool.getObjectMaterial(this.object, this.materialSlot);

        material[this.attributeName].fromArray(this.oldValue!);

        // this.editor.signals.materialChanged.dispatch(this.object, this.materialSlot);
    }

    update(cmd: SetMaterialVectorCommand) {
        this.newValue = cmd.newValue;
    }

    toJSON() {
        const output = super.toJSON();

        output.objectUuid = this.object.uuid;
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