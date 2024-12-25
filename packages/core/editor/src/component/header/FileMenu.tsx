import {Button, Dropdown} from "antd";
import React from "react";
import MenuItem from "./MenuItem.tsx";
import {useViewer} from "../../store/useStore.ts";
import {ExporterTool} from @plum-render/three-sdk";
import {isMesh} from "three-is";

enum FileFormat {
    DRC = "DRC",
    GLB = "GLB",
    GLTF = "GLTF",
    OBJ = "OBJ",
    PLY = "PLY",
    PLY_BINARY = "PLY (BINARY)",
    STL = "STL",
    STL_BINARY = "STL (BINARY)",
    USDZ = "USDZ"
}


const FileMenu: React.FC = () => {
    const viewer = useViewer();
    const handleNew = () => {
        console.log("新建被点击");
    };

    const handleOpen = () => {
        console.log("打开被点击");
    };

    const handleSave = () => {
        console.log("保存被点击");
        viewer?.serializeScene.downJson();
    };
    const handleZipSave = () => {
        console.log("保存被点击");
        viewer?.serializeScene.downPack();
    };

    const handleImport = () => {
        console.log("导入被点击");
    };

    const handleExport = (format: FileFormat) => {
        console.log(`导出为 ${format} 格式`);
        switch (format) {
            case FileFormat.DRC: {
                const object = viewer?.editor.selector.selectObject
                if (isMesh(object)) {
                    ExporterTool.getInstance().exportDRC(object)
                }
                break;
            }
            case FileFormat.GLB: {
                const object = viewer?.scene
                if (object) {
                    ExporterTool.getInstance().exportGLB(object, {
                        binary: true,
                    })
                }
                break;
            }
            case FileFormat.GLTF: {
                const object = viewer?.scene
                if (object) {
                    ExporterTool.getInstance().exportGLB(object)
                }
                break;
            }
            case FileFormat.OBJ: {
                const object = viewer?.scene
                if (object) {
                    ExporterTool.getInstance().exportOBJ(object)
                }
                break;
            }
            case FileFormat.PLY: {
                const object = viewer?.scene
                if (object) {
                    ExporterTool.getInstance().exportPLY(object)
                }
                break;
            }
            case FileFormat.PLY_BINARY: {
                const object = viewer?.scene
                if (object) {
                    ExporterTool.getInstance().exportPLY(object, {
                        binary: true,
                    })
                }
                break;
            }
            case FileFormat.STL: {
                const object = viewer?.scene
                if (object) {
                    ExporterTool.getInstance().exportSTL(object)
                }
                break;
            }
            case FileFormat.STL_BINARY: {
                const object = viewer?.scene
                if (object) {
                    ExporterTool.getInstance().exportSTL(object, {
                        binary: true,
                    })
                }
                break;
            }
            case FileFormat.USDZ: {
                const object = viewer?.scene
                if (object) {
                    ExporterTool.getInstance().exportUSDZ(object)
                }
                break;
            }
        }
    };

    const items = [
        {
            key: '新建',
            label: (
                <MenuItem name={'新建'} hotKey={'Ctrl N'} onClick={handleNew}/>
            )
        },
        {
            key: '打开',
            label: (
                <MenuItem name={'打开'} hotKey={'Ctrl O'} onClick={handleOpen}/>
            )
        },
        {
            key: '保存',
            label: (
                <MenuItem name={'保存'} onClick={handleSave}/>
            ),
            children: [
                {
                    key: '原生',
                    label: (
                        <MenuItem name={'原生'} onClick={handleSave}/>
                    )
                },
                {
                    key: '压缩',
                    label: (
                        <MenuItem name={'压缩'} onClick={handleZipSave}/>
                    )
                },
            ]
        },
        {
            key: '导入',
            label: (
                <MenuItem name={'导入'} onClick={handleImport}/>
            )
        },
        {
            key: '导出',
            label: '导出',
            children: Object.values(FileFormat).map(format => ({
                key: format,
                label: (
                    <MenuItem name={format} onClick={() => handleExport(format)}/>
                )
            }))
        }
    ];

    return (
        <Dropdown
            trigger={["click"]}
            menu={{items}}
            overlayClassName={'plum-menu-dropDown'}
            placement="bottomLeft"
        >
            <Button type="text">文件</Button>
        </Dropdown>
    );
}

export default FileMenu;