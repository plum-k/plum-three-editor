import {SceneJSONObject} from "three/src/scenes/Scene";

export namespace SerializeInterface {

    export interface Metadata {
        version: number;
        type: string;
        generator: string;
    }

    export interface Geometry {
        uuid: string;
        type: string;
        width: number;
        height: number;
        depth: number;
        widthSegments: number;
        heightSegments: number;
        depthSegments: number;
        data: {
            attributes: GeometryAttributes;
            index: GeometryIndex;
            boundingSphere: BoundingSphere;
        }
    }

    export interface GeometryAttributes {
        position: GeometryAttributesItem;
        normal: GeometryAttributesItem;
        uv: GeometryAttributesItem;

        [key: string]: GeometryAttributesItem
    }

    export interface GeometryAttributesItem {
        itemSize: number;
        type: string;
        array: string | Array<string>;
        normalized: boolean;
    }

    export interface BoundingSphere {
        center: number[];
        radius: number;
    }

    export interface GeometryIndex {
        type: string;
        array: string;
    }

    export interface Material {
        uuid: string;
        type: string;
        name: string;
        color: number;
        roughness: number;
        metalness: number;
        emissive: number;
        envMapRotation: any[];
        envMapIntensity: number;
        blendColor: number;
    }

    export interface UserData {
        mimeType: string;
    }

    export interface Texture {
        uuid: string;
        name: string;
        image: string;
        mapping: number;
        channel: number;
        repeat: number[];
        offset: number[];
        center: number[];
        rotation: number;
        wrap: number[];
        format: number;
        internalFormat?: any;
        type: number;
        colorSpace: string;
        minFilter: number;
        magFilter: number;
        anisotropy: number;
        flipY: boolean;
        generateMipmaps: boolean;
        premultiplyAlpha: boolean;
        unpackAlignment: number;
        userData: UserData;
    }

    export interface Image {
        uuid: string;
        url: string;
    }

    export interface Children {
        uuid: string;
        type: string;
        layers: number;
        matrix: number[];
        up: number[];
    }

    export interface Object {
        uuid: string;
        type: string;
        name: string;
        layers: number;
        matrix: number[];
        up: number[];
        children: Children[];
        backgroundRotation: any[];
        environmentRotation: any[];
    }

    export interface Scene extends SceneJSONObject {
        geometries: Geometry[];
        materials: Material[];
        textures: Texture[];
        images: Image[];
    }

    export interface Viewer {
        scene: Scene;
    }

    export interface ZipScene {
        images: Array<string>;
        geometries: Array<string>;
        materials: Array<string>;
        metadata: Array<string>;
        textures: Array<string>;
    }

    export interface ZipViewer {
        scene: ZipScene;
    }
}