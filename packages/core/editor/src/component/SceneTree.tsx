import React, {Key, useEffect, useMemo, useRef, useState} from 'react';
import {Input, Tree, TreeDataNode, type TreeProps} from 'antd';
import {useSelectObject3D, useSetSelectKey, useSetSelectObject3D, useViewer} from "../store/useStore.ts";
import * as THREE from "three";
import {Viewer} from @plum-render/three-sdk";
import {EventDataNode} from 'antd/es/tree/index';
import {Item, ItemParams, Menu as RightMenu, useContextMenu} from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import {isNil} from "lodash-es";
import {EyeInvisibleOutlined, EyeOutlined} from '@ant-design/icons';
import {useToggle} from "ahooks";

// 自定义节点标题渲染组件
const TitleRender = (props: any) => {
    const viewer = useViewer();
    const {node} = props;
    const {name, uuid, visible, type} = node;

    // 切换对象的可见性
    const handleVisible = (value: boolean) => {
        if (viewer) {
            let object = viewer.getObjectByUuid(uuid);
            if (object) {
                viewer.editor.setValueExecute(object, ["visible"], value);
            }
        }
    }

    return (
        <div>
            {name}
            {
                visible ? <EyeOutlined onClick={() => handleVisible(false)} style={{marginLeft: "15px"}}/> :
                    <EyeInvisibleOutlined onClick={() => handleVisible(true)} style={{marginLeft: "15px"}}/>
            }
        </div>
    )
}

// 将 THREE 对象转换为树节点
const getTree = (objects: Array<THREE.Object3D>) => {
    const nodes: Array<any> = [];
    for (let i = 0, l = objects.length; i < l; i++) {
        const object = objects[i];
        const {name, uuid, children, type, visible} = object;
        const _name = name === "" ? type : name; // 如果名称为空则使用类型
        let node: any = {
            uuid,
            visible,
            name: _name,
            key: uuid,
            children: [],
        };
        if (children.length !== 0) {
            node.children = getTree(children); // 递归获取子节点
        }
        nodes.push(node);
    }
    return nodes;
}

// 获取场景树
const getSceneTree = (viewer: Viewer) => {
    const scene = viewer.scene;
    return getTree(scene.children);
}

// 场景树组件
const SceneTree: React.FC = () => {
    const [baseTreeData, setBaseTreeData] = useState<TreeDataNode[]>([]);
    const viewer = useViewer();
    const setSelectObject3D = useSetSelectObject3D();
    const setSelectKey = useSetSelectKey();
    const selectObject3D = useSelectObject3D();
    const [inputValue, setInputValue] = useState('');
    const [searchState, {toggle, setLeft, setRight}] = useToggle();

    const [isVisible, setVisible] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<Array<Key>>([]);

    // 监听 viewer 和选择变化
    useEffect(() => {
        if (viewer) {
            viewer?.editor.editorEventManager.sceneGraphChanged.subscribe(() => {
                console.log("更新");
                updateTree(); // 更新树数据
            });
            viewer?.editor.editorEventManager.objectSelected.subscribe((obj) => {
                setSelectObject3D(obj);
                if (obj) {
                    setExpandedKeys([obj.uuid]); // 更新展开的节点
                    window.setTimeout(() => {
                        treeRef.current.scrollTo({key: obj.uuid}); // 滚动到选中的节点
                    }, 500)
                }
            });
        }
    }, [viewer]);

    // 更新树数据
    const updateTree = () => {
        if (viewer) {
            let baseTreeData = getSceneTree(viewer);
            setBaseTreeData(baseTreeData);
        }
    }

    // 处理搜索输入并过滤树节点
    const treeData = useMemo(() => {
        if (inputValue === "") {
            return baseTreeData;
        }

        // 深度优先遍历剔除不匹配的节点
        function pruneTreeDFS(nodes, condition) {
            return nodes.reduce((acc, node) => {
                const children = node.children ? pruneTreeDFS(node.children, condition) : [];
                if (condition(node) || children.length > 0) {
                    acc.push({...node, children});
                }
                return acc;
            }, []);
        }

        let result = pruneTreeDFS(baseTreeData, (node) => {
            return node.name.includes(inputValue); // 根据输入值过滤节点
        });
        return result;
    }, [baseTreeData, searchState]);

    // 处理节点选择事件
    const onSelect = (electedKeys: Key[], info: {
        event: 'select';
        selected: boolean;
        node: EventDataNode<any>;
        selectedNodes: any[];
        nativeEvent: MouseEvent;
    }) => {
        setSelectKey(electedKeys);
        const length = electedKeys.length;
        if (length > 0 && viewer?.scene) {
            const select = electedKeys[0];
            const object = viewer?.getObjectByUuid(select as string);
            if (object) {
                viewer?.editor.selector.select(object); // 选择对象
            }
        }
    }

    // 监听选中的对象变化
    useEffect(() => {
        if (isNil(selectObject3D)) {
            setSelectedKeys([]);
        } else {
            setSelectedKeys([selectObject3D.uuid]);
        }
    }, [selectObject3D]);

    // 右键菜单处理
    const RightClick = (info: {
        event: React.MouseEvent;
        node: EventDataNode<any>;
    }) => {
        const {event, node} = info;
        const {key} = node;
        if (viewer?.scene) {
            const object = viewer?.getObjectByUuid(key as string);
            if (object) {
                setVisible(() => {
                    return object.visible;
                });
            }
            show({
                event: event,
                props: node
            });
        }
    }

    const MENU_ID = 'Menu1';
    const {show} = useContextMenu({
        id: MENU_ID,
    });

    // 右键菜单中的可见性切换
    const visible = (value: ItemParams) => {
        const {props} = value;
        const {key} = props;
        const object = viewer?.getObjectByUuid(key as string);
        if (object) {
            object.visible = !object.visible; // 切换可见性
        }
    }

    // 右键菜单中的删除操作
    const remove = (value: ItemParams) => {
        const {props} = value;
        const {key} = props;
        const object = viewer?.getObjectByUuid(key as string);
        if (object) {
            viewer?.editor.removeObjectExecute(object); // 删除对象
        }
    }

    // 拖放事件处理
    const onDragEnter: TreeProps['onDragEnter'] = (info) => {
        // 处理拖拽进入事件
    };

    const onDrop: TreeProps['onDrop'] = (info) => {
        console.log("onDrop");
        const dragNode = info.dragNode;
        const dragNodeKey = dragNode.key; // 被拖动的节点
        const node = info.node;
        const nodeKey = node.key; // 目标节点

        viewer?.editor.moveObjectExecute(dragNodeKey as string, nodeKey as string, 1); // 执行移动操作
    };

    const onDragEnd: TreeProps['onDragEnd'] = (info) => {
        // 处理拖拽结束事件
    };

    const onDoubleClick: TreeProps['onDoubleClick'] = (info) => {
        if (viewer) {
            viewer.editor?.fitToSelected(); // 适应选中的对象
        }
    };

    // 处理搜索框输入
    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const searchHandle = () => {
        toggle(); // 切换搜索状态
    }

    const onClear = () => {
        setInputValue(""); // 清空搜索框
    }

    useEffect(() => {
        if (inputValue === "") {
            toggle(); // 如果搜索框为空，切换搜索状态
        }
    }, [inputValue]);

    const treeRef = useRef<any>(undefined);
    const [expandedKeys, setExpandedKeys] = useState<Array<string>>([]); // 初始化展开的节点

    // 更新展开的节点
    const onExpand: TreeProps["onExpand"] = (expandedKeysValue, info) => {
        console.log("onExpand", info.expanded);
        console.log("expandedKeysValue", expandedKeysValue);
        console.log(expandedKeys);
        // 根据 info.expanded 的值更新 expandedKeys
        if (info.expanded) {
            // 如果节点被展开，则向 expandedKeys 数组添加该节点的 key
            setExpandedKeys(prevKeys => [...prevKeys, ...expandedKeysValue as string[]]);
        } else {
            // 如果节点被收起，则从 expandedKeys 数组中删除该节点的 key
            setExpandedKeys(prevKeys => prevKeys.filter(key => key !== info.node.key));
        }
    };
    const treeContainer = useRef<any>();
    const [height, setHeight] = useState<number>(300); // 初始化展开的节点
    useEffect(() => {
        if (treeContainer.current) {
            // 获取当前高度
            const currentHeight = treeContainer.current.offsetHeight;
            setHeight(currentHeight - 30); // 更新高度状态
            console.log('当前高度:', currentHeight); // 打印高度
        }
    }, []); // 空依赖数组，组件挂载时执行
    return (
        <div className={"tree-container"} ref={treeContainer}>
            <Input.Search placeholder="" onChange={handleChange} allowClear onClear={onClear} onSearch={searchHandle}/>
            <RightMenu id={MENU_ID}>
                <Item onClick={visible}>
                    {
                        isVisible ? "隐藏" : "显示"
                    }
                </Item>
                <Item onClick={remove}>
                    删除
                </Item>
            </RightMenu>
            <Tree
                ref={treeRef}
                titleRender={(node) => {
                    return <TitleRender node={node}/>
                }}
                expandedKeys={expandedKeys} // 控制展开的节点
                onExpand={onExpand} // 处理展开/收起事件
                autoExpandParent
                height={height}
                onSelect={onSelect}
                selectedKeys={selectedKeys}
                showLine
                showIcon
                draggable
                blockNode
                onDoubleClick={onDoubleClick}
                onDragEnter={onDragEnter}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
                treeData={treeData} // 渲染的树数据
                onRightClick={RightClick} // 右键菜单
            />
        </div>
    );
};

export default SceneTree;