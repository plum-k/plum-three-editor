import Control from "./SidePane/Control.tsx";
import SidePane from "./SidePane/SidePane.tsx";
import Statistical from "./SidePane/Statistical.tsx";

let isInit = false;
const SceneView: React.FC = () => {
    const canvasContainer = React.createRef<HTMLDivElement>();
    const viewer = useViewer()
    const setViewer = useSetViewer()
    const id = useAppId()
    useEffect(() => {
        // console.log("layout", id)
    }, [id])

    // 快捷键
    useHotkeys('ctrl+z', () => {
        if (viewer) {
            viewer.editor.undo();
        }
    }, [viewer])
    useHotkeys('ctrl+y', () => {
        if (viewer) {
            viewer.editor.redo();
        }
    }, [viewer])
    useHotkeys('f', () => {
        if (viewer) {
            viewer.editor.fitToSelected().then(()=>{

            } );
        }
    }, [viewer])

    const addBox = (_viewer, num) => {
        let cube;
        for (let i = 0; i < num; i++) {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshStandardMaterial({color: 0x00ff00});
            material.name = `测试材质${i}`
            cube = new THREE.Mesh(geometry, material);
            cube.name = `测试模型${i}`
            _viewer.scene.add(cube)
        }
        return cube;
    }
    const setSpinning = useSetSpinning()
    const setPercent = useSetPercent()

    useEffect(() => {
        if (canvasContainer.current) {
            console.log("zix111111")
            if (viewer === undefined && !isInit) {
                console.log("33333333333")
                let _viewer!: Viewer
                if (id) {
                    _viewer = new Viewer(canvasContainer.current, {
                        // appUrl: "https://plum-1257591271.cos.ap-shanghai.myqcloud.com/test.zip"
                    });
                } else {
                    _viewer = new Viewer(canvasContainer.current, {
                        // appUrl: "https://plum-1257591271.cos.ap-shanghai.myqcloud.com/test.zip"
                    });
                }
                _viewer.assetManager.startSubject.subscribe((value) => {
                    // setPercent(value.loaded / value.total)
                })

                _viewer.assetManager.progressSubject.subscribe((value) => {
                    // todo
                    // setPercent(value.loaded / value.total)
                    // console.log(value.loaded / value.total)
                    if (value.loaded === value.total) {
                        setSpinning(false)
                    }
                })

                setViewer(_viewer);
                useLightTest(_viewer)

                _viewer.threeCameraControls.cameraControls.setPosition(5, 5, 5);
                _viewer.threeCameraControls.cameraControls.setTarget(0, 0, 0);
                isInit = true;
                const cube = addBox(_viewer, 1)

                setTimeout(() => {
                    // _viewer?.eventManager.objectSelected.next(cube);
                    // useAmbientLight(_viewer)
                    // useDraw(_viewer)

                    // usePostProcessingManagerTest(_viewer);
                    // useSearchTest(_viewer)
                    // useMeasureTest(_viewer)
                }, 1000)

                const asset = new GltfModelAsset({
                    // loadUrl: "/Rampaging T-Rex.glb",
                    loadUrl: "/testModel/大场景_WEBGL.glb",
                    // url: "/aaa.glb",
                })
                _viewer.assetManager.loadGltf(asset).then((model) => {
                    console.log(model)
                    _viewer.editor.addObjectExecute(model);
                })
                // _viewer.assetManager.loadAsset(asset).then((model) => {
                //     _viewer.scene.add(model);
                //     const obj = _viewer.scene.getObjectByName("苏珊娜")
                //     _viewer?.eventManager.objectSelected.next(obj);
                //
                //     useZipTest(_viewer);
                //
                // });
                // useEnvironment(_viewer);
                // useLine(_viewer)
                // useQuadraticBezierLine(_viewer)
                // useCubicBezierLine(_viewer)
                // useCatmullRomLine(_viewer)

                // useLine2(_viewer)
                // useQuadraticBezierLine2(_viewer)
                // useCubicBezierLine2(_viewer)
                // useCatmullRomLine2(_viewer)
            }
        }
    }, [])

    const loadMode = (node: IFolder) => {
        const {name} = node;
        COSApi.getObjectUrl(name).then((url) => {
            console.log(url)
            const asset = new GltfModelAsset({
                url: url,
                // url: "/aaa.glb",
            })
            viewer?.assetManager.loadAsset(asset).then((model) => {
                viewer.scene.add(model);
            });
        })
    }


    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        // console.log(e)
        // todo
        // event.preventDefault();
        //     const data = event.dataTransfer.getData('data')
        //     const value = JSON.parse(data)
        //     loadMode(value)
    }

    return (
        <Fragment>
            <div className={"container"} ref={canvasContainer}>
                <Control/>
                <SidePane/>
                <Statistical/>
            </div>
        </Fragment>
    )
}

export default SceneView;

