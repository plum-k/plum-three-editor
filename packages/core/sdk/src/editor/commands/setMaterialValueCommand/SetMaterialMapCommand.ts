import {Command} from "../Command";
import * as THREE from 'three';
import {Texture} from 'three';
import {get, set} from "lodash-es";

export class SetMaterialMapCommand extends Command<Texture | null> {

    materialSlot: number;
    mapName: string;

    constructor(
        object: Object3D,
        mapName: string = '',
        newValue: Texture | null,
        materialSlot: number = -1
    ) {
        super();

        this.type = 'SetMaterialMapCommand';
        this.name = 'command/SetMaterialMap' + ': ' + mapName;

        this.object = object;
        this.materialSlot = materialSlot;

        const material = (object !== null) ? Tool.getObjectMaterial(object as Mesh, materialSlot) : null;

        this.oldValue = (material !== null) ? get(material, mapName) : undefined;
        this.newValue = newValue;

        this.mapName = mapName;
    }

    execute(): void {
        if (this.oldValue !== null && this.oldValue !== undefined) this.oldValue.dispose();
        const material = Tool.getObjectMaterial(this.object as Mesh, this.materialSlot);
        set(material, this.mapName, this.newValue)
        material.needsUpdate = true;

        // this.editor.signals.materialChanged.dispatch(this.object, this.materialSlot);
    }

    undo(): void {
        const material = Tool.getObjectMaterial(this.object as Mesh, this.materialSlot);
        set(material, this.mapName, this.oldValue)
        material.needsUpdate = true;

        // this.editor.signals.materialChanged.dispatch(this.object, this.materialSlot);
    }

    update(command: this): void {
    }

    toJSON(): any {
        // const output = super.toJSON();
        //
        // output.objectUuid = this.object!.uuid;
        // output.mapName = this.mapName;
        // output.newValue = serializeMap(this.newValue);
        // output.oldValue = serializeMap(this.oldValue);
        // output.materialSlot = this.materialSlot;
        //
        // return output;
        //
        // // serializes a map (Texture)
        // function serializeMap(map: Texture | null | undefined): any {
        //     if (map === null || map === undefined) return null;
        //
        //     const meta = {
        //         geometries: {},
        //         materials: {},
        //         textures: {},
        //         images: {},
        //     };
        //
        //     const json = map.toJSON(meta);
        //     const images = extractFromCache(meta.images);
        //     if (images.length > 0) json.images = images;
        //     json.sourceFile = map.sourceFile;
        //
        //     return json;
        // }
        //
        // // Note: The function 'extractFromCache' is copied from Object3D.toJSON()
        // // extract data from the cache hash
        // // remove metadata on each item
        // // and return as array
        // function extractFromCache(cache: { [key: string]: any }): any[] {
        //     const values = [];
        //     for (const key in cache) {
        //         const data = cache[key];
        //         delete data.metadata;
        //         values.push(data);
        //     }
        //     return values;
        // }
    }

    fromJSON(json: any): void {
        // super.fromJSON(json);
        //
        // this.object = this.editor.objectByUuid(json.objectUuid)!;
        // this.mapName = json.mapName;
        // this.oldValue = parseTexture(json.oldValue);
        // this.newValue = parseTexture(json.newValue);
        // this.materialSlot = json.materialSlot;
        //
        // function parseTexture(json: any): Texture | null {
        //     let map = null;
        //     if (json !== null) {
        //         const loader = new ObjectLoader();
        //         const images = loader.parseImages(json.images);
        //         const textures = loader.parseTextures([json], images);
        //         map = textures[json.uuid];
        //         map.sourceFile = json.sourceFile;
        //     }
        //     return map;
        // }
    }
}