import React, {Fragment} from "react";
import {Tabs} from "antd";
import ObjectAttribute from "./attributePane/ObjectAttribute.tsx";
import MaterialAttribute from "./attributePane/MaterialAttribute.tsx";
import SceneAttribute from "./attributePane/SceneAttribute.tsx";
import GeometryAttribute from "./attributePane/GeometryAttribute.tsx";

const AttributePane: React.FC = () => {
    const initTab = [
        {
            label: `属性`,
            key: "ObjectAttribute",
            children: <ObjectAttribute/>,
        },
        {
            label: `几何`,
            key: "GeometryAttribute",
            children: <GeometryAttribute/>,
        },
        {
            label: `材质`,
            key: "MaterialAttribute",
            children: <MaterialAttribute/>,
        },
        {
            label: `场景`,
            key: "SceneAttribute",
            children: <SceneAttribute/>,
        }
    ]
    return (
        <Fragment>
            <Tabs size={"middle"}
                  className={"plum-tabs"}
                  defaultActiveKey="SceneAttribute"
                  tabPosition={"left"}
                  items={initTab}
            />
        </Fragment>
    )
}

export default AttributePane;
