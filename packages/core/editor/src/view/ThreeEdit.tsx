import React, {Fragment} from "react";
import Layout from "../component/Laout.tsx";
import Header from "../component/header/Header.tsx";
import {Spin} from "antd";
import {usePercent, useSpinning} from "../store/useStore.ts";

const ThreeEdit: React.FC = () => {
    const spinning = useSpinning()
    const percent = usePercent()
    // useEffect(() => {
    //     console.log(percent)
    // }, [percent]);
    return (
        <Fragment>
            <Spin spinning={spinning} percent={percent} fullscreen/>
            <Header/>
            <Layout/>
        </Fragment>
    )
}

export default ThreeEdit;
