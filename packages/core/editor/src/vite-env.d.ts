/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_BUCKET: string;
    readonly VITE_REGION: string;
    readonly VITE_SERVER: string;
    readonly VITE_EXAMPLE: string;
    readonly VITE_DOC: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

import type {Bus} from "./hooks";
import type {Viewer} from "@plum-render/three-sdk";

declare module 'vue' {
    interface ComponentCustomProperties {
        bus: Bus;
    }
}

declare global {
    interface Window {
        viewer?: Viewer;
    }
}

export {}
