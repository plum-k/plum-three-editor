import {Command} from "../Command";
import * as THREE from 'three';
import {Object3D, ObjectLoader} from 'three';
import undefined from "../../../interface/Undefined";
import {isNil} from "lodash-es";


export class RemoveObjectCommand extends Command {
    parent: Object3D | undefined;
    index: number = -1;

    constructor(object: Object3D) {
        super();

        this.type = 'RemoveObjectCommand';

        this.object = object;
        this.parent = this.object?.parent || null;

        if (this.parent !== null) {
            this.index = this.parent.children.indexOf(this.object!);
        }

        if (object !== null) {
            this.name = 'command/RemoveObject' + ': ' + object.name;
        }
    }

    execute() {
        this.editor.removeObject(this.object!);
        this.editor.selector.deselect();
    }

    undo() {
        this.editor.addObject(this.object!, this.parent, this.index);
        this.editor.selector.select(this.object!);
    }

    toJSON() {
        const output = super.toJSON();

        output.object = this.object?.toJSON();
        output.index = this.index;
        output.parentUuid = this.parent?.uuid;

        return output;
    }

    fromJSON(json: any) {
        super.fromJSON(json);

        this.parent = this.editor.objectByUuid(json.parentUuid);
        if (!this.parent) {
            this.parent = this.editor.scene;
        }

        this.index = json.index;

        let object = this.editor.objectByUuid(json.object?.object.uuid);

        if (!isNil(object)) {
            this.object = object;
        } else {
            const loader = new ObjectLoader();
            this.object = loader.parse(json.object);
        }
    }

    update(command: this): void {
    }
}