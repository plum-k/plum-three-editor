import React, {Fragment} from "react";
import {Form, InputNumber} from "antd";
import useItemUpdate from "./useItemUpdate.ts";
import BaseItemProps from "./BaseItemProps.ts";

export interface IInputNumberItemProps extends BaseItemProps {

}

const InputNumberItem: React.FC<IInputNumberItemProps> = (props: IInputNumberItemProps) => {
    const {syncChange, ...rest} = props
    const {isValue} = useItemUpdate(props);
    return (
        <Fragment>
            {
                isValue &&
                <Form.Item {...rest}>
                    <InputNumber size="small"/>
                </Form.Item>
            }
        </Fragment>
    )
}

export default InputNumberItem;
