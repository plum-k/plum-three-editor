import * as THREE from "three"
import {presetsObj, PresetsType} from "./environmentAssets";
import {isArray, isNil} from "lodash-es";
import {Component, IComponentOptions} from "../Component";
import {TextureEncoding} from "three-stdlib/types/shared";
import {Asset} from "../asset/Asset";
import {deepMergeRetain} from "../../tool";
import {isDirectionalLight} from "three-is";

export interface IEnvironment extends IComponentOptions {
    frames?: number
    near?: number
    far?: number
    resolution?: number

    map?: THREE.Texture
    preset?: PresetsType
    scene?: THREE.Scene
    ground?:
        | boolean
        | {
        radius?: number
        height?: number
        scale?: number
    }
}

export enum EnvironmentMode {
    ENVIRONMENT,
    BACKGROUND,
    ALL,
    NUll
}

export interface ISceneEnvAttribute {
    backgroundBlurriness?: number
    backgroundIntensity?: number
    backgroundRotation?: THREE.Euler
    environmentIntensity?: number
    environmentRotation?: THREE.Euler
}

interface ISetEnvOption {
    mode: EnvironmentMode,
    texture: THREE.Texture,
    color: THREE.Color
    sceneEnvAttribute?: ISceneEnvAttribute,
}

export interface ISetEnvironmentOptions extends ISetEnvOption {
    files?: string | string[]
    path?: string
    preset?: PresetsType
    // extensions?: (loader: Loader) => void
    encoding?: TextureEncoding;
}

export class EnvironmentManage extends Component {

    constructor(options: IEnvironment) {
        super(options);
        const {preset} = options;
        if (preset) {
        }
    }

    setEnv(options: ISetEnvOption) {
        const _options = deepMergeRetain({}, options)
        const {background, texture, mode, sceneEnvAttribute} = _options;

        const oldbg = this.scene.background
        const oldenv = this.scene.environment
        const oldSceneProps = {
            backgroundBlurriness: this.scene.backgroundBlurriness,
            backgroundIntensity: this.scene.backgroundIntensity,
            backgroundRotation: this.scene.backgroundRotation?.clone?.() ?? [0, 0, 0],
            environmentIntensity: this.scene.environmentIntensity,
            environmentRotation: this.scene.environmentRotation?.clone?.() ?? [0, 0, 0],
        }
        for (const [key, value] of Object.entries(sceneEnvAttribute)) {

            this.scene[key] = value
        }

        switch (mode) {
            case EnvironmentMode.ENVIRONMENT:
                this.scene.environment = texture
                break
            case EnvironmentMode.BACKGROUND:
                this.scene.background = texture
                break
            case EnvironmentMode.ALL:
                this.scene.environment = texture
                this.scene.background = texture
                break
        }

    }


    setEnvironment(options: Partial<ISetEnvironmentOptions> = {}) {
        const _options = deepMergeRetain(options, {
            files: ['/px.png', '/nx.png', '/py.png', '/ny.png', '/pz.png', '/nz.png'],
            path: '',
            preset: undefined,
            encoding: undefined,
            mode: EnvironmentMode.ALL,
            sceneEnvAttribute: {}
        });
        let {background, files, path, preset, encoding, mode, color} = _options;
        if (mode === EnvironmentMode.NUll) {
            this.setEnv({
                mode: EnvironmentMode.NUll,
                texture: null,
                color: null,
                ..._options
            })
            return;
        }
        if (!isNil(color)) {
            this.setEnv({
                texture: color,
                ..._options
            })
            return;
        }

        if (preset) {
            if (!(preset in presetsObj)) throw new Error('Preset must be one of: ' + Object.keys(presetsObj).join(', '))
            files = presetsObj[preset]
        }

        const isCubeMap = isArray(files) && files.length === 6
        const isGainMap = isArray(files) && files.length === 3 && files.some((file) => file.endsWith('json'))
        const firstEntry = isArray(files) ? files[0] : files

        let multiFile = isArray(files)
        let extension: string | false | undefined = undefined

        if (isCubeMap) {
            extension = 'cube';
        } else if (isGainMap) {
            extension = 'webp';
        } else if (firstEntry.startsWith('data:application/exr')) {
            extension = 'exr';
        } else if (firstEntry.startsWith('data:application/hdr')) {
            extension = 'hdr';
        } else if (firstEntry.startsWith('data:image/jpeg')) {
            extension = 'jpg';
        } else {

        }
        const asset = new Asset({
            loadUrl: files,
            extension: extension
        })
        this.assetManager.loadAsset(asset).then((result) => {

            this.setEnv({
                texture: result as THREE.Texture,
                ..._options
            })
        })
    }

    createDefaultLight() {
        let isHasDirectionalLight = false
        this.scene.traverse((obj) => {
            if (isDirectionalLight(obj)) {
                isHasDirectionalLight = true;
            }
        })
        if (!isHasDirectionalLight) {
            const light = new THREE.DirectionalLight(0xffffff, 2);
            light.name = 'DirectionalLight';
            light.position.set(5, 10, 7.5);
            this.scene.add(light);
        }
    }

    createDefaultEnvironment() {


    }
}
