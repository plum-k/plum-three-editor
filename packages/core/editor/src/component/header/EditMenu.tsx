import {Button, Dropdown} from "antd";
import React from "react";
import MenuItem from "./MenuItem.tsx";

const EditMenu: React.FC = () => {
    const items = [
        {
            key: '撤销',
            label: (
                <MenuItem name={'撤销'} hotKey={'Ctrl Z'}/>
            )
        },
        {
            key: 'mesh',
            label: (
                <MenuItem name={'重做'} hotKey={'Ctrl Y'}/>
            )
        },
        {
            key: '重做历史',
            label: (
                <MenuItem name={'重做历史'}/>
            )
        },
        {
            key: '偏好设置',
            label: (
                <MenuItem name={'偏好设置'} hotKey={'Ctrl ,'}/>
            )
        }
    ];
    return <Dropdown trigger={["click"]} menu={{items}} overlayClassName={'plum-menu-dropDown'} placement="bottomLeft">
        <Button type="text">编辑</Button>
    </Dropdown>
}

export default EditMenu;