import React from "react";
import FileMenu from "./FileMenu.tsx";
import EditMenu from "./EditMenu.tsx";
import AddMenu from "./AddMenu.tsx";
import {useToken} from "common";

const Header: React.FC = () => {
    const token = useToken()
    return (

        <header style={{
            position: "relative",
            zIndex: 10,
            height: "32px",
            display: "flex",
            background: token.colorBgBase,
            boxShadow: token.boxShadowTertiary
        }}>
            <div style={{
                //color: #ffffff,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "4px",
                fontSize: "20px",
            }}>
                Plum
            </div>
            <div style={{
                height: "100%",
                display: "flex",
                //justify-content: center;,
                alignItems: "center",
                // gap: "10px",
                //color: #ffffff,
                marginLeft: " 10px",
                fontSize: "15px",
            }}>
                <FileMenu/>
                <EditMenu/>
                <AddMenu/>
            </div>
        </header>
    )
}

export default Header;














