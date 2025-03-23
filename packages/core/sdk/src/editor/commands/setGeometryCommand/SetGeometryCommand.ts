import {Command} from "../Command";
import * as THREE from 'three';
import {Geometry, ObjectLoader} from 'three';

/**
 * @param editor Editor
 * @param object Object3D
 * @param newValue Geometry
 * @constructor
 */
export class SetGeometryCommand extends Command {
    type: string = 'SetGeometryCommand';
    updatable: boolean = true;

    constructor(object: Mesh, newValue: BufferGeometry) {
        super();

        this.name = 'command/SetGeometry';
        this.object = object;
        this.oldValue = (object !== null) ? object.geometry : null;
        this.newValue = newValue;
    }

    execute() {
        this.object!.geometry.dispose();
        this.object!.geometry = this.newValue!;
        this.object!.geometry.computeBoundingSphere();

        this.editor.signals.geometryChanged.dispatch(this.object!);
        this.editor.signals.sceneGraphChanged.dispatch();
    }

    undo() {
        this.object!.geometry.dispose();
        this.object!.geometry = this.oldValue!;
        this.object!.geometry.computeBoundingSphere();

        this.editor.signals.geometryChanged.dispatch(this.object!);
        this.editor.signals.sceneGraphChanged.dispatch();
    }

    update(cmd: SetGeometryCommand) {
        this.newValue = cmd.newValue;
    }

    toJSON() {
        const output = super.toJSON();

        output.objectUuid = this.object!.uuid;
        output.oldValue = this.oldValue!.toJSON();
        output.newValue = this.newValue!.toJSON();

        return output;
    }

    fromJSON(json: any) {
        super.fromJSON(json);

        this.object = this.editor.objectByUuid(json.objectUuid)!;

        this.oldValue = parseGeometry(json.oldValue);
        this.newValue = parseGeometry(json.newValue);

        function parseGeometry(data: any): Geometry {
            const loader = new ObjectLoader();
            return loader.parseGeometries([data])[data.uuid];
        }
    }
}