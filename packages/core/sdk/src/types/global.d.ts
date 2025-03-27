interface Window {
}

declare module 'three' {
    interface AnimationMixer {
        stats: {
            actions: {
                inUse: number;
                total: number;
            }
        }
    }
}
declare module 'three/examples/jsm/exporters/DRACOExporter.js' {
    class DRACOExporter {
        static MESH_EDGEBREAKER_ENCODING: number;
    }
}

export {}