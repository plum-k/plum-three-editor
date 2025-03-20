import {ESceneSaveType} from "./ESceneSaveType";

export interface ISceneSaveProgressEvent {
    type: ESceneSaveType;
    name: string;
    total: number;
    loaded: number;
}