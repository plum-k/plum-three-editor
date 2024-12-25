const tree = [
    {
        id: '1',
        title: '节点1',
        children: [
            {
                id: '1-1',
                title: '节点1-1'
            },
            {
                id: '1-2',
                title: '节点',
                children: [
                    {
                        id: '1-2-1',
                        title: '节点'
                    }
                ]
            }
        ]
    },
    {
        id: '2',
        title: '节点2',
        children: [
            {
                id: '2-1',
                title: '节点2-1'
            }
        ]
    }
];

// 深度优先遍历剔除不需要的子节点的函数
function pruneTreeDFS(nodes, condition) {
    return nodes.reduce((acc, node) => {
        // 处理子节点
        const children = node.children ? pruneTreeDFS(node.children, condition) : [];

        // 仅保留符合条件的节点
        if (condition(node) || children.length > 0) {
            acc.push({...node, children});
        }

        return acc;
    }, []);
}

// 示例条件函数：只保留 title 中包含 "1" 的节点
function condition(node) {
    return node.title.includes('1');
}

// 剔除不需要的子节点
const prunedTree = pruneTreeDFS(tree, condition);

// 打印剔除后的树
console.log(JSON.stringify(prunedTree, null, 2));