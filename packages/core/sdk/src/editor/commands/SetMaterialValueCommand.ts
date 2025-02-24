import {Command} from "./Command";
import * as THREE from 'three';
import {set} from "lodash-es";
import {ThreeTool} from "../../tool";


export class SetMaterialValueCommand extends Command {
    type: string = 'SetMaterialValueCommand';
    materialSlot: number;
    attributeName: string;

    constructor(
        object: THREE.Object3D,
        attributeName: string,
        newValue: any,
        materialSlot = -1) {
        super();
        this.updatable = true;
        this.name = 'command/SetMaterialValue' + ': ' + attributeName;

        this.object = object;
        this.materialSlot = materialSlot;

        const material = (object !== null) ? ThreeTool.getObjectMaterial(object as THREE.Mesh, materialSlot) : null;

        this.oldValue = (material !== null) ? material[attributeName] : null;
        this.newValue = newValue;

        this.attributeName = attributeName;
    }

    execute(): void {
        const material = ThreeTool.getObjectMaterial(this.object as THREE.Mesh, this.materialSlot);
        set(material, this.attributeName, this.newValue);
        material.needsUpdate = true;
        // this.editor.signals.objectChanged.dispatch(this.object!);
        // this.editor.signals.materialChanged.dispatch(this.object!, this.materialSlot);
    }

    undo(): void {
        const material = ThreeTool.getObjectMaterial(this.object as THREE.Mesh, this.materialSlot);
        set(material, this.attributeName, this.oldValue);
        material.needsUpdate = true;
        // this.editor.signals.objectChanged.dispatch(this.object!);
        // this.editor.signals.materialChanged.dispatch(this.object!, this.materialSlot);
    }

    update(cmd: SetMaterialValueCommand): void {
        this.newValue = cmd.newValue;
    }

    fromJSON(json: any) {

        super.fromJSON(json);

        this.attributeName = json.attributeName;
        this.oldValue = json.oldValue;
        this.newValue = json.newValue;
        this.object = this.editor.objectByUuid(json.objectUuid);
        this.materialSlot = json.materialSlot;

    }
}