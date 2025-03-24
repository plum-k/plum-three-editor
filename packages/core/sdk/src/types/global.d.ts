
interface Window {
}

declare module 'three' {
    interface   AnimationMixer {
        stats: {
            actions: {
                inUse: number;
                total: number;
            }
        }
    }
}

export {}