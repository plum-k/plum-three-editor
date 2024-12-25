import Command from "./Command";
import * as THREE from 'three';
import {reflectGet} from "@plum-render/tool";

/**
 * @param editor Editor
 * @param object THREE.Object3D
 * @param attributeName string
 * @param newValue integer representing a hex color value
 * @constructor
 */
export default class SetColorCommand extends Command<THREE.Color> {
    type: string = 'SetColorCommand';
    attributeName: string;

    constructor(
        object: THREE.Object3D,
        attributeName: string,
        newValue: THREE.Color
    ) {
        super();
        this.updatable = true;
        this.name = 'command/SetColor' + ': ' + attributeName;
        this.object = object;
        this.attributeName = attributeName;
        this.oldValue = object !== null ? reflectGet(this.object, this.attributeName).getHex() : null;
        this.newValue = newValue;
    }

    execute() {
        if (this.object) {
            reflectGet(this.object, this.attributeName).setHex(this.newValue!);
            // this.editor.signals.objectChanged.dispatch(this.object!);
        }
    }

    undo() {
        if (this.object) {
            reflectGet(this.object, this.attributeName).setHex(this.oldValue!);
            // this.editor.signals.objectChanged.dispatch(this.object!);
        }
    }

    update(cmd: SetColorCommand) {
        this.newValue = cmd.newValue;
    }

    toJSON() {
        const output = super.toJSON();
        output.objectUuid = this.object?.uuid;
        output.attributeName = this.attributeName;
        output.oldValue = this.oldValue;
        output.newValue = this.newValue;
        return output;
    }

    fromJSON(json: any) {
        super.fromJSON(json);
        this.object = this.editor.objectByUuid(json.objectUuid)!;
        this.attributeName = json.attributeName;
        this.oldValue = json.oldValue;
        this.newValue = json.newValue;
    }
}