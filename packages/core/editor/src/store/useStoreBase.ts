import {create} from 'zustand'
import {Viewer} from @plum-render/three-sdk";
import * as THREE from "three";
import {Key} from "react";

type State = {
    viewer: Viewer | undefined,
    selectKey: Array<Key>,
    selectObject3D: THREE.Object3D | undefined,
    percent: number,
    spinning: boolean,
}
type Action = {
    setViewer: (viewer: State['viewer']) => void,
    setSelectKey: (selectUUid: State['selectKey']) => void,
    setSelectObject3D: (value: State['selectObject3D']) => void,
    setPercent: (percent: State['percent']) => void,
    setSpinning: (spinning: State['spinning']) => void,
}
const useStoreBase = create<State & Action>((set) => ({
    viewer: undefined,
    selectKey: [],
    selectObject3D: undefined,
    percent: 0,
    spinning: false,
    setViewer: (viewer) => {
        set((state) => {
            return {
                viewer: viewer
            }
        })
    },
    setSelectKey: (value) => {
        set((state) => {
            return {
                selectKey: value
            }
        })
    },
    setSelectObject3D: (value) => {
        set((state) => {
            return {
                selectObject3D: value
            }
        })
    },
    setPercent: (percent) => {
        set((state) => {
            return {
                percent: percent
            }
        })
    },
    setSpinning: (spinning) => {
        set((state) => {
            return {
                spinning: spinning
            }
        })
    },
}))

export default useStoreBase;