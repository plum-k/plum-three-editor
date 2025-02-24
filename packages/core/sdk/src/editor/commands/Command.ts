import Editor from "../Editor";
import * as THREE from "three";
import {PropertyPath, toPath} from "lodash-es";

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
    attributePath: PropertyPath = []
    attributeName: string = ""

    object!: THREE.Object3D;
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
        return toPath(this.attributePath);
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
