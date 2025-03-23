import {Command} from "../Command";
import * as THREE from 'three';

/**
 * @param editor Editor
 * @param object Object3D
 * @param attributeName string
 * @param newValue number, string, boolean or object
 * @constructor
 */
export class SetGeometryValueCommand extends Command {
    type: string = 'SetGeometryValueCommand';
    attributeName: string;

    constructor(object: Object3D, attributeName: string = '', newValue: any = null) {
        super();

        this.name = 'command/SetGeometryValue' + ': ' + attributeName;
        this.object = object;
        this.attributeName = attributeName;
        this.oldValue = (object !== null) ? object.geometry[attributeName] : null;
        this.newValue = newValue;
    }

    execute() {
        this.object!.geometry[this.attributeName] = this.newValue;
        // this.editor.signals.objectChanged.dispatch(this.object!);
        // this.editor.signals.geometryChanged.dispatch();
        // this.editor.signals.sceneGraphChanged.dispatch();
    }

    undo() {
        this.object!.geometry[this.attributeName] = this.oldValue;
        // this.editor.signals.objectChanged.dispatch(this.object!);
        // this.editor.signals.geometryChanged.dispatch();
        // this.editor.signals.sceneGraphChanged.dispatch();
    }

    toJSON() {
        const output = super.toJSON();

        output.objectUuid = this.object!.uuid;
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

    update(command: this): void {
    }
}