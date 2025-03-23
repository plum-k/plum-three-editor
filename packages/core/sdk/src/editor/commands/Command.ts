
import {PropertyPath, toPath} from "lodash-es";
import {Editor} from "../Editor";

export interface CommandJson {
    id: number;
    type: string;
    name: string;

    [key: string]: any;
}

export abstract class Command<T = any> {
    id: number = 0;
    inMemory: boolean = false;
    updatable: boolean = false;
    type: string = '';
    name: string = '';
    editor!: Editor;
    attributeName: PropertyPath = []

    object!: Object3D;
    oldValue!: T;
    newValue!: T;

    protected constructor() {
        this.type = this.constructor.name;
    }

    abstract execute(): void

    abstract undo(): void

    // 1 分钟有多个值变化 只更新一次
    abstract update(command: this): void

    getAttributeName() {
        return toPath(this.attributeName);
    }

    toJSON(): CommandJson {
        return {
            type: this.type,
            id: this.id,
            name: this.name
        };
    }

    fromJSON(json: CommandJson): void {
        this.inMemory = true;
        this.type = json.type;
        this.id = json.id;
        this.name = json.name;
    }
}
