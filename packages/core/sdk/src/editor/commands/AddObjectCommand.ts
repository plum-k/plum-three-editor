import {Object3D, ObjectLoader} from 'three';
import {Command} from "./Command";

export class AddObjectCommand extends Command {
    type: string = 'AddObjectCommand';

    constructor(object: Object3D) {
        super();
        this.object = object;

        if (object !== null) {
            this.name = 'command/AddObject' + ': ' + object.name;
        }
    }

    execute(): void {
        this.editor.addObject(this.object!);
        this.editor.selector.select(this.object!);
    }

    undo(): void {
        this.editor.removeObject(this.object!);
        this.editor.selector.deselect();
    }

    update(command: this): void {
    }

    toJSON(): any {
        const output = super.toJSON();
        output.object = this.object?.toJSON();
        return output;
    }

    fromJSON(json: any): void {
        super.fromJSON(json);
        this.object = this.editor.objectByUuid(json.object.object.uuid)!;

        if (this.object === undefined) {
            const loader = new ObjectLoader();
            this.object = loader.parse(json.object);
        }
    }
}