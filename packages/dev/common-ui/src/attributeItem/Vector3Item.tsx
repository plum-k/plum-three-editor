import {Col, Form, Row} from "antd";
import BaseItemProps from "./BaseItemProps.ts";
import React, {Fragment} from "react";
import {InputNumberItem} from "./index.ts";
import useItemUpdate from "./useItemUpdate.ts";

export interface IVector3ItemProps extends BaseItemProps {
    isVertical?: boolean;
}

const Vector3Item: React.FC<IVector3ItemProps> = (props: IVector3ItemProps) => {
    const {basePropertyName, convertData, isVertical, ...rest} = {isVertical: true, ...props}
    const {isValue} = useItemUpdate(props);
    return (
        <Fragment>
            {
                isValue &&
                <Form.Item {...rest}>
                    {
                        isVertical ? <Fragment>
                                <InputNumberItem  label={"x"} name={[basePropertyName, "x"]}/>
                                <InputNumberItem  label={"x"} name={[basePropertyName, "y"]}/>
                                <InputNumberItem  label={"z"} name={[basePropertyName, "z"]}/>
                            </Fragment>
                            : <Row>
                                <Col span={"8"}>
                                    <InputNumberItem  label={"x"} name={[basePropertyName, "x"]}/>
                                </Col>
                                <Col span={"8"}>
                                    <InputNumberItem  label={"x"} name={[basePropertyName, "y"]}/>
                                </Col>
                                <Col span={"8"}>
                                    <InputNumberItem  label={"z"} name={[basePropertyName, "z"]}/>
                                </Col>
                            </Row>

                    }
                </Form.Item>}
        </Fragment>
    )
}

export default Vector3Item;

