import React, {Fragment} from "react";
import {Col, Form, InputNumber, Row, Slider} from "antd";
import useItemUpdate from "./useItemUpdate.ts";
import BaseItemProps from "./BaseItemProps.ts";

export interface INumberSliderItemProps extends BaseItemProps {
    max?:number;
    min?:number;
    step?:number;
}

const NumberSliderItem: React.FC<INumberSliderItemProps> = (props: INumberSliderItemProps) => {
    const {syncChange, name,min,max,step,...rest} = props;
    const {isValue} = useItemUpdate(props);
    return (
        <Fragment>
            {
                isValue &&
                <Form.Item {...rest}>
                    <Row>
                        <Col span={4}>
                            <Form.Item name={name}>
                                <InputNumber style={{width: "40px"}} size="small" controls={false} min={min} max={max} step={step}/>
                            </Form.Item>
                        </Col>
                        <Col span={12} style={{marginLeft: "10px"}}>
                            <Form.Item name={name}>
                                <Slider min={min} max={max} step={step}/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form.Item>
            }
        </Fragment>
    )
}

export default NumberSliderItem;
