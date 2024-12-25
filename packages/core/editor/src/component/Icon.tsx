import {CSSProperties} from "react";
import {cn} from "common";

interface IConProps {
    iconName: string;
    className?: any;
    onClick?: () => void;
    style?: CSSProperties
}

export default function Icon(props: IConProps) {
    const {iconName, className, onClick, style} = props;

    const _className = cn("icon", className)

    return (
        <svg style={style} onClick={onClick} className={_className} aria-hidden="true">
            <use xlinkHref={`#icon-${iconName}`}/>
        </svg>
    )
}