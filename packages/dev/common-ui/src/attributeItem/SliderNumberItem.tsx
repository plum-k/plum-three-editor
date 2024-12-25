import React, {Fragment} from "react";
import {Col, Form, InputNumber, Row, Slider} from "antd";
import useItemUpdate from "./useItemUpdate.ts";
import BaseItemProps from "./BaseItemProps.ts";
import {SliderBaseProps} from "antd/es/slider";
import {InputNumberProps} from "antd/es/input-number";

export interface ISliderNumberItemBaseProps {
    sliderBaseProps?: SliderBaseProps;
    inputNumberProps?: InputNumberProps;
    range?: {
        max: number,
        min: number;
        step?: number;
    }
}

export interface SliderNumberWrapperProps extends BaseItemProps, ISliderNumberItemBaseProps {
    id?: string;
    value?: any;
    onChange?: (value: any) => void;
}

const SliderNumberWrapper: React.FC<SliderNumberWrapperProps> = (props: SliderNumberWrapperProps) => {
    const {value, onChange, sliderBaseProps, inputNumberProps, range} = props;

    return <Row>
        <Col span={16}>
            <Slider
                {...sliderBaseProps}
                onChange={onChange}
                value={value}
                {...range}
            />
        </Col>
        <Col span={4}>
            <InputNumber
                {...inputNumberProps}
                style={{margin: '0 16px', width: '50px'}}
                value={value}
                onChange={onChange}
                {...range}
            />
        </Col>
    </Row>
}
export type ISliderNumberItemProps = ISliderNumberItemBaseProps & BaseItemProps;

const SliderNumberItem: React.FC<ISliderNumberItemProps> = (props: ISliderNumberItemProps) => {
    const {} = props
    const {isValue} = useItemUpdate(props);
    return (
        <Fragment>
            {
                isValue ?
                    <Form.Item {...props}>
                        <SliderNumberWrapper {...props}/>
                    </Form.Item> : null}
        </Fragment>
    )
}

export default SliderNumberItem;
