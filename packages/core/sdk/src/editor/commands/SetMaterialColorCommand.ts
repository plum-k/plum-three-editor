import {Command} from "./Command";
import * as THREE from 'three';
import {Tool} from "../../tool";


export class SetMaterialColorCommand extends Command<number> {
    type: string = 'SetMaterialColorCommand';
    materialSlot: number;

    constructor(object: THREE.Object3D, attributeName: string = '', newValue: number, materialSlot: number = -1) {
        super();
        this.updatable = true;
        this.name = 'command/SetMaterialColor' + ': ' + attributeName;

        this.object = object;
        this.materialSlot = materialSlot;

        const material = (object !== null) ? Tool.getObjectMaterial(object, materialSlot) : null;
        // @ts-ignore
        this.oldValue = (material !== null) ? material[attributeName].getStyle() : null;
        
        this.newValue = newValue;
        this.attributeName = attributeName;
    }

    execute() {
        const material = Tool.getObjectMaterial(this.object as THREE.Mesh, this.materialSlot);
        // @ts-ignore
        material[this.attributeName].setStyle(this.newValue!);
        // this.editor.signals.materialChanged.dispatch(this.object, this.materialSlot);
    }

    undo() {
        const material = Tool.getObjectMaterial(this.object as THREE.Mesh, this.materialSlot);
        // @ts-ignore
        material[this.attributeName].setStyle(this.oldValue!);
        // this.editor.signals.materialChanged.dispatch(this.object, this.materialSlot);
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