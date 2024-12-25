import React from "react";

export interface MenuProps {
    name: string,
    hotKey?: string,
    onClick?: () => void
}

const MenuItem: React.FC<MenuProps> = (props: MenuProps) => {
    const {name, hotKey, onClick} = props;
    return (
        <div onClick={onClick}
        style={{
            width: "100px",
            justifyContent: "space-between",
            display: "inline-flex",
        }}
        >
            <div>{name}</div>
            {
                hotKey ? <div>{hotKey}</div> : null
            }
        </div>
    )
}

export default MenuItem